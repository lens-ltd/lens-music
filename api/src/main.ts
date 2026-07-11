// First: Node 26+ SlowBuffer polyfill for legacy JWT chain (must precede AppModule/JWT).
import './polyfills/node-compat';
import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import logger from './utils/logger';

const bootLogger = logger.child({ module: 'main' });

process.on('uncaughtException', (err) => {
  bootLogger.error({ err }, 'Uncaught exception during startup');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  bootLogger.error({ err: reason }, 'Unhandled rejection during startup');
  process.exit(1);
});

async function bootstrap() {
  try {
    bootLogger.info('Bootstrapping Nest application');

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidUnknownValues: false,
      })
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    const port = Number(process.env.PORT) || 8080;
    await app.listen(port);

    bootLogger.info({ port }, 'API running');
  } catch (err) {
    bootLogger.error({ err }, 'Failed to bootstrap Nest application');
    // Ensure a non-zero exit so the error is visible
    process.exit(1);
  }
}

void bootstrap();
