import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import logger from './utils/logger';

async function bootstrap() {
  try {
    logger.child({ module: 'main' }).info('Bootstrapping Nest application');

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

    logger.child({ module: 'main' }).info({ port }, 'API running');
  } catch (err) {
    logger.child({ module: 'main' }).error({ err }, 'Failed to bootstrap Nest application');
    // Ensure a non-zero exit so the error is visible
    process.exit(1);
  }
}

bootstrap();
