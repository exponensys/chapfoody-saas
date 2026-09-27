import { BadRequestException, ForbiddenException, HttpException, NotFoundException } from '@nestjs/common';

import { AppException } from '../errors/app.exception.js';
import { ERROR_CODES } from '../errors/error-codes.js';
import { defaultMessageForStatus, translateException } from './translate-exception.js';

describe('translateException — our own exceptions', () => {
  it('keeps the status, code, message and details of an AppException', () => {
    const translated = translateException(
      new AppException(409, ERROR_CODES.CONFLICT, 'Un client porte déjà cet e-mail.', {
        field: 'email',
      }),
    );

    expect(translated).toEqual({
      status: 409,
      code: ERROR_CODES.CONFLICT,
      message: 'Un client porte déjà cet e-mail.',
      details: { field: 'email' },
      isUnexpected: false,
    });
  });

  it('exposes helpers with the documented codes', () => {
    expect(translateException(AppException.notFound('Introuvable')).code).toBe(ERROR_CODES.NOT_FOUND);
    expect(translateException(AppException.serviceUnavailable('Indisponible'))).toMatchObject({
      status: 503,
      code: ERROR_CODES.SERVICE_UNAVAILABLE,
    });
  });
});

describe('translateException — framework exceptions', () => {
  it('replaces the English reason phrase of a bare Nest exception with French wording', () => {
    const translated = translateException(new NotFoundException());

    expect(translated.status).toBe(404);
    expect(translated.code).toBe(ERROR_CODES.NOT_FOUND);
    expect(translated.message).toBe('Ressource introuvable.');
    expect(translated.message).not.toBe('Not Found');
  });

  it('passes a custom message through untouched', () => {
    const translated = translateException(new ForbiddenException('Accès réservé à l’administrateur.'));

    expect(translated).toMatchObject({
      status: 403,
      code: ERROR_CODES.FORBIDDEN,
      message: 'Accès réservé à l’administrateur.',
      isUnexpected: false,
    });
  });

  it('prefers an explicit code from the response body', () => {
    const exception = new HttpException(
      { code: 'FEATURE_NOT_IN_SUBSCRIPTION', message: 'Plan Premium requis.', details: { plan: 'premium' } },
      403,
    );

    expect(translateException(exception)).toMatchObject({
      code: 'FEATURE_NOT_IN_SUBSCRIPTION',
      message: 'Plan Premium requis.',
      details: { plan: 'premium' },
    });
  });

  it("replaces Express's unmatched-route message, which would otherwise leak English and the framework", () => {
    // This is exactly what Express answers when no route matches: NestJS is never
    // reached, so without this rule the client would read "Cannot GET /v1/x".
    const expressLike = new HttpException(
      { statusCode: 404, message: 'Cannot GET /v1/does-not-exist', error: 'Not Found' },
      404,
    );

    const translated = translateException(expressLike);

    expect(translated.message).toBe('Ressource introuvable.');
    expect(translated.message).not.toContain('Cannot GET');
  });

  it('moves an array message (framework validation) into details.errors', () => {
    const translated = translateException(new BadRequestException(['email must be an email']));

    expect(translated.code).toBe(ERROR_CODES.VALIDATION_FAILED);
    expect(translated.message).toBe('La requête est invalide.');
    expect(translated.details).toEqual({ errors: ['email must be an email'] });
  });
});

describe('translateException — non-Nest throwables', () => {
  it('reads the status of an Express-level error such as a body-parser rejection', () => {
    // Express middleware throws plain errors carrying `status`/`statusCode`.
    const tooLarge = Object.assign(new Error('request entity too large'), { status: 413 });

    expect(translateException(tooLarge)).toMatchObject({
      status: 413,
      code: ERROR_CODES.PAYLOAD_TOO_LARGE,
      message: 'Le contenu envoyé est trop volumineux.',
      isUnexpected: false,
    });
  });

  it('accepts statusCode as well as status', () => {
    const error = Object.assign(new Error('nope'), { statusCode: 429 });
    expect(translateException(error).code).toBe(ERROR_CODES.RATE_LIMITED);
  });

  it('hides the message of an unexpected failure and flags it for logging', () => {
    const translated = translateException(new Error('connect ECONNREFUSED 127.0.0.1:5432'));

    expect(translated).toEqual({
      status: 500,
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Une erreur interne est survenue.',
      isUnexpected: true,
    });
    // The internal detail must not be part of what the client receives.
    expect(translated.message).not.toContain('ECONNREFUSED');
  });

  it('handles a thrown string and a thrown null without crashing', () => {
    for (const thrown of ['boom', null, undefined, 42]) {
      expect(translateException(thrown)).toMatchObject({
        status: 500,
        code: ERROR_CODES.INTERNAL_ERROR,
        isUnexpected: true,
      });
    }
  });

  it('ignores an out-of-range status on an arbitrary object', () => {
    expect(translateException(Object.assign(new Error('x'), { status: 99 })).status).toBe(500);
    expect(translateException(Object.assign(new Error('x'), { status: 900 })).status).toBe(500);
  });
});

describe('defaultMessageForStatus', () => {
  it('always answers in French, including for unknown statuses', () => {
    expect(defaultMessageForStatus(404)).toBe('Ressource introuvable.');
    expect(defaultMessageForStatus(418)).toBe('La requête a échoué.');
    expect(defaultMessageForStatus(599)).toBe('Une erreur interne est survenue.');
  });
});
