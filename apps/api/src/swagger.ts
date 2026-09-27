import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';

/**
 * OpenAPI document definition, shared by the running server and by the export
 * script.
 *
 * Having one builder used in both places is what keeps
 * `packages/api-client/openapi.json` byte-identical to what `/docs` serves — a
 * generated document that drifts from the live API is worse than none at all.
 */
export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Chapfoody API')
    .setDescription(
      [
        'API de la plateforme Chapfoody : gestion et vente en ligne pour les restaurants,',
        'bars et maquis, métiers de bouche, épiceries et fruiteries, boutiques et supermarchés,',
        'producteurs, traiteurs, livreurs et affiliés.',
        '',
        'Conventions de réponse :',
        '- Toute erreur renvoie `{ code, message, details?, requestId, path, timestamp }`.',
        '- `code` est stable et exploitable par le client (voir @chapfoody/api-client).',
        '- `requestId` permet de retrouver la requête dans les journaux.',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      // Name used by @ApiBearerAuth() on protected routes from M3 onwards.
      'access-token',
    )
    .addTag('health', 'Sondes de disponibilité (hors préfixe /v1)')
    .addTag('meta', 'Métadonnées de la plateforme')
    .build();

  return SwaggerModule.createDocument(app, config);
}

/**
 * Serves the interactive documentation.
 *
 * Only mounted when `env.swaggerEnabled` is true (everything except production),
 * decided by the caller so this module stays free of environment logic.
 */
export function setupSwagger(app: INestApplication): void {
  SwaggerModule.setup('docs', app, buildOpenApiDocument(app), {
    jsonDocumentUrl: 'docs/json',
    swaggerOptions: { persistAuthorization: true },
  });
}
