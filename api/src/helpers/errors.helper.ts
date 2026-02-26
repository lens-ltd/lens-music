import logger from "../utils/logger";

export interface CustomError extends Error {
  data: object | null | undefined;
}

export class AppError extends Error implements CustomError {
  statusCode: number;
  errorCode: string;
  data: object | null | undefined;
  appModule: string;

  constructor(
    message: string,
    appModule: string,
    statusCode: number,
    errorCode: string = 'GENERIC_ERROR',
    data: object | null | undefined = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.data = data;
    this.appModule = appModule;
    logger.child({ appModule }).error({ statusCode, errorCode, data }, message);
    Error.captureStackTrace(this, this.constructor);
  }
}

// VALIDATION ERROR
export class ValidationError extends AppError {
  constructor(message: string, appModule: string = 'VALIDATION', errorCode: string = 'VALIDATION_ERROR') {
    super(message, appModule, 400, errorCode);
  }
}

// NOT FOUND ERROR
export class NotFoundError extends AppError {
  constructor(message: string, appModule: string = 'NOT_FOUND', errorCode: string = 'NOT_FOUND') {
    super(message, appModule, 404, errorCode);
  }
}

// CONFLICT ERROR
export class ConflictError extends AppError {
  constructor(
    message: string,
    data: object | null | undefined = null,
    appModule: string = 'CONFLICT',
    errorCode: string = 'CONFLICT',
  ) {
    super(message, appModule, 409, errorCode, data);
  }
}
