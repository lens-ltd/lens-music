import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppError } from '../../helpers/errors.helper';
import logger from '../../utils/logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      return response.status(status).json(
        typeof payload === 'string' ? { message: payload } : payload,
      );
    }

    if (exception instanceof AppError) {
      return response.status(exception.statusCode).json({
        message: exception.message,
        errorCode: exception.errorCode,
        ...(exception.data ? { data: exception.data } : {}),
      });
    }

    logger.child({ module: 'HttpExceptionFilter' }).error(
      { err: exception },
      exception instanceof Error ? exception.message : 'Unhandled exception',
    );

    const message =
      exception instanceof Error && process.env.NODE_ENV !== 'production'
        ? exception.message
        : 'Internal server error';

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message,
    });
  }
}
