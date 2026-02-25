import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const httpException =
      exception instanceof HttpException
        ? exception
        : new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);

    const status = httpException.getStatus();
    const payload = httpException.getResponse();

    response.status(status).json(
      typeof payload === 'string' ? { message: payload } : payload
    );
  }
}
