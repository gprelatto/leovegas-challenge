import { Catch, ExceptionFilter, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter, ErrorResponse } from './base-exception.filter';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    const responseError: ErrorResponse = {
      status,
      title: 'There was a problem during your request',
      detail: exception.message || 'Internal Server Error',
      timestamp: new Date().toISOString(),
    };

    this.logError(exception, request, responseError);

    response.status(status).json(responseError);
  }
}
