import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

type RsponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object[];
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Global exception handler that catches all unhandled exceptions.
   *
   * Formats error responses with consistent structure containing:
   * - `statusCode`: HTTP status code (extracted from HttpException or defaults to 500)
   * - `timestamp`: ISO-8601 formatted timestamp when the error occurred
   * - `path`: Request URL path where the error happened
   * - `response`: Error message or response object from the exception
   *
   * Logs errors via NestJS Logger and delegates to BaseExceptionFilter for additional handling.
   *
   * @param exception - The caught exception (HttpException or any other error)
   * @param host - ArgumentsHost providing access to request/response objects
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseObj: RsponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      responseObj.statusCode = exception.getStatus();
      responseObj.response = exception.getResponse() as string;
    } else {
      responseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseObj.response = 'Internal Server Error';
    }

    response.status(responseObj.statusCode).json(responseObj);

    const stack = exception instanceof Error ? exception.stack : undefined;
    this.logger.error(responseObj.response, stack, AllExceptionsFilter.name);
    super.catch(exception, host);
  }
}
