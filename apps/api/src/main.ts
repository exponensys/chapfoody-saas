import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { Logger as PinoLogger, LoggerErrorInterceptor } from 'nestjs-pino';

import { SERVICE_NAME } from './app.constants.js';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';
import { loadEnv } from './config/env.js';

async function bootstrap(): Promise<void> {
  const env = loadEnv();

  // bufferLogs holds framework output until pino is installed below, so no log
  // line is emitted unstructured or lost during start-up.
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // One structured stream for framework logs and request logs alike.
  app.useLogger(app.get(PinoLogger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // CORS, correlation ids, validation, error envelope, prefix, Swagger — all shared
  // with the test harness (see configure-app.ts).
  configureApp(app, env);

  // SIGTERM/SIGINT must run onModuleDestroy: closing Prisma and the queue events
  // is what keeps a rolling deploy from dropping in-flight work.
  app.enableShutdownHooks();

  await app.listen(env.port);

  const logger = app.get(PinoLogger);
  logger.log(`${SERVICE_NAME} listening on http://localhost:${env.port} (${env.nodeEnv})`);
  if (env.swaggerEnabled) {
    logger.log(`OpenAPI documentation served at http://localhost:${env.port}/docs`);
  }
}

bootstrap().catch((error: unknown) => {
  // Fail loudly and exit non-zero. The logger may not exist yet (this can be a
  // configuration error), so stderr is the only reliable channel here.
  process.stderr.write(`Failed to start ${SERVICE_NAME}: ${String(error)}\n`);
  process.exitCode = 1;
});
