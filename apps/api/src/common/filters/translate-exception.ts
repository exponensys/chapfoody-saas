import { STATUS_CODES } from 'node:http';

import { HttpException } from '@nestjs/common';

import { AppException } from '../errors/app.exception.js';
import { ERROR_CODES, defaultCodeForStatus } from '../errors/error-codes.js';

/** Result of normalising any thrown value into the error envelope's content. */
export interface TranslatedError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
  /**
   * True when the cause is an unexpected failure. Its message is replaced by a
   * generic one so that internals (stack traces, SQL, file paths) never reach a
   * client — the real error is logged instead.
   */
  isUnexpected: boolean;
}

const GENERIC_MESSAGE = 'Une erreur interne est survenue.';

const DEFAULT_MESSAGES: Readonly<Record<number, string>> = {
  400: 'La requête est invalide.',
  401: 'Authentification requise.',
  403: 'Accès refusé.',
  404: 'Ressource introuvable.',
  405: 'Méthode non autorisée pour cette ressource.',
  409: "Conflit avec l'état actuel de la ressource.",
  413: 'Le contenu envoyé est trop volumineux.',
  422: 'La requête ne peut pas être traitée.',
  429: 'Trop de requêtes. Merci de réessayer dans un instant.',
  500: GENERIC_MESSAGE,
  503: 'Service temporairement indisponible.',
};

/** User-presentable default message for a status, in French like the product. */
export function defaultMessageForStatus(status: number): string {
  return DEFAULT_MESSAGES[status] ?? (status >= 500 ? GENERIC_MESSAGE : 'La requête a échoué.');
}

/**
 * Express's own router 404, e.g. "Cannot GET /v1/does-not-exist".
 *
 * When no route matches, Express answers before NestJS does, with an English
 * technical message that also reveals the framework. It is a framework default in
 * every sense that matters, so it is replaced by our own wording.
 */
const EXPRESS_ROUTER_MESSAGE = /^Cannot (GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) /;

/**
 * True when a message is just the framework's own default.
 *
 * `new NotFoundException()` without arguments carries the English reason phrase
 * ("Not Found"), and an unmatched route carries Express's "Cannot GET …". Returning
 * either would put English, framework-flavoured text in front of a French-speaking
 * user, so both are replaced by our own wording — while a *custom* message is passed
 * through untouched.
 */
function isFrameworkDefaultMessage(message: string, status: number): boolean {
  return STATUS_CODES[status] === message || EXPRESS_ROUTER_MESSAGE.test(message);
}

/**
 * Reads a status from a non-Nest error that carries one.
 *
 * Express and its middleware (body-parser, multer) throw plain errors with
 * `status`/`statusCode`; without this they would all collapse into a 500.
 */
function readNumericStatus(exception: unknown): number | undefined {
  if (typeof exception !== 'object' || exception === null) return undefined;

  const candidate = exception as { status?: unknown; statusCode?: unknown };
  const status =
    typeof candidate.status === 'number'
      ? candidate.status
      : typeof candidate.statusCode === 'number'
        ? candidate.statusCode
        : undefined;

  return status !== undefined && status >= 400 && status <= 599 ? status : undefined;
}

/**
 * Normalises anything that can be thrown into the shape the error envelope needs.
 *
 * Pure and free of Nest runtime state, so every branch is unit-tested directly.
 */
export function translateException(exception: unknown): TranslatedError {
  // Our own exceptions already carry a stable code and safe message.
  if (exception instanceof AppException) {
    return {
      status: exception.getStatus(),
      code: exception.code,
      message: exception.message,
      details: exception.details,
      isUnexpected: false,
    };
  }

  if (exception instanceof HttpException) {
    const status = exception.getStatus();
    const body = exception.getResponse();
    const code = defaultCodeForStatus(status);

    if (typeof body === 'string') {
      const message = isFrameworkDefaultMessage(body, status)
        ? defaultMessageForStatus(status)
        : body;

      return { status, code, message, isUnexpected: false };
    }

    const record = body as Record<string, unknown>;
    const explicitCode = typeof record.code === 'string' ? record.code : code;
    const rawMessage = record.message;

    let message: string;
    let details = record.details;

    if (typeof rawMessage === 'string') {
      message = isFrameworkDefaultMessage(rawMessage, status)
        ? defaultMessageForStatus(status)
        : rawMessage;
    } else if (Array.isArray(rawMessage)) {
      // Framework validation raised before our custom factory (or by a library).
      message = defaultMessageForStatus(status);
      details = details ?? { errors: rawMessage };
    } else {
      message = defaultMessageForStatus(status);
    }

    return { status, code: explicitCode, message, details, isUnexpected: false };
  }

  // Express/middleware errors that carry a status but are not HttpExceptions.
  const status = readNumericStatus(exception);
  if (status !== undefined) {
    return {
      status,
      code: defaultCodeForStatus(status),
      message: defaultMessageForStatus(status),
      isUnexpected: status >= 500,
    };
  }

  // Anything else is a genuine bug: log it, tell the client nothing.
  return {
    status: 500,
    code: ERROR_CODES.INTERNAL_ERROR,
    message: GENERIC_MESSAGE,
    isUnexpected: true,
  };
}
