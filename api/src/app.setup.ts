import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * Global app configuration shared by `main.ts` and the e2e test app, so tests
 * exercise the same prefix, validation and error shape as production.
 */
export const configureApp = (app: INestApplication): INestApplication => {
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
  return app;
};
