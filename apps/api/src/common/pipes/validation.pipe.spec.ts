import type { ArgumentMetadata } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsString, Min, ValidateNested } from 'class-validator';

import { AppException } from '../errors/app.exception.js';
import { ERROR_CODES } from '../errors/error-codes.js';
import {
  createValidationPipe,
  flattenValidationErrors,
  validationExceptionFactory,
} from './validation.pipe.js';

class OrderLineDto {
  @IsString()
  sku!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

class CreateOrderDto {
  @IsEmail()
  email!: string;

  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  lines!: OrderLineDto[];
}

const bodyMetadata: ArgumentMetadata = { type: 'body', metatype: CreateOrderDto };

/** Runs the real pipe (not a stub) and returns whatever it rejected with. */
async function reject(payload: unknown): Promise<AppException> {
  return createValidationPipe()
    .transform(payload, bodyMetadata)
    .then(() => {
      throw new Error('The payload should have been rejected.');
    })
    .catch((error: unknown) => error as AppException);
}

describe('createValidationPipe', () => {
  it('accepts a valid payload and gives back a DTO instance', async () => {
    const result = (await createValidationPipe().transform(
      { email: 'client@chapfoody.test', lines: [{ sku: 'BURGER', quantity: 2 }] },
      bodyMetadata,
    )) as CreateOrderDto;

    // `transform: true` must actually instantiate the class, otherwise the
    // validators would never have run in the first place.
    expect(result).toBeInstanceOf(CreateOrderDto);
    expect(result.lines[0]).toBeInstanceOf(OrderLineDto);
  });

  it('rejects unknown properties instead of silently dropping them', async () => {
    const error = await reject({
      email: 'client@chapfoody.test',
      lines: [],
      // The classic mass-assignment attempt: harmless-looking, but it must fail.
      isSuperAdmin: true,
    });

    expect(error.getStatus()).toBe(400);
    expect(error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
    expect(error.details).toMatchObject({ isSuperAdmin: ['whitelistValidation'] });
  });

  it('reports the exact field path of every invalid value', async () => {
    const error = await reject({
      email: 'pas-un-email',
      lines: [{ sku: 'BURGER', quantity: 0 }],
    });

    expect(error.details).toMatchObject({
      email: ['isEmail'],
      'lines.0.quantity': ['min'],
    });
  });

  it('reports a missing required field', async () => {
    const error = await reject({ lines: [] });

    expect(error.details).toMatchObject({ email: ['isEmail'] });
  });

  it('rejects a payload that is not an object at all', async () => {
    const error = await reject('not-an-object');

    expect(error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });
});

describe('flattenValidationErrors', () => {
  it('returns an empty object when there is nothing to report', () => {
    expect(flattenValidationErrors([])).toEqual({});
  });

  it('merges constraints that target the same field', async () => {
    class RangeDto {
      @IsInt()
      @Min(10)
      value!: number;
    }

    const error = await createValidationPipe()
      .transform({ value: 1.5 }, { type: 'body', metatype: RangeDto })
      .catch((caught: unknown) => caught);

    // Both constraints fail and both must be reported for the same path. The ORDER
    // is class-validator's, not ours, so the assertion must not depend on it.
    const details = (error as AppException).details as Record<string, string[]>;

    expect(details.value).toHaveLength(2);
    expect(details.value).toEqual(expect.arrayContaining(['isInt', 'min']));
  });
});

describe('validationExceptionFactory', () => {
  it('produces the documented envelope shape', () => {
    const exception = validationExceptionFactory([]);

    expect(exception).toBeInstanceOf(AppException);
    expect(exception.getStatus()).toBe(400);
    expect(exception.code).toBe(ERROR_CODES.VALIDATION_FAILED);
    expect(exception.message).toBe('La requête contient des données invalides.');
  });
});
