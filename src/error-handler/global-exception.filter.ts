import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter, ErrorResponse } from './base-exception.filter';

type ErrorWithResponse = Error & { response: { data: { message: string }; status: HttpStatus } };

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  async catch(error: ErrorWithResponse, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const title = error.name || 'Unhandled Exception';
    const detail = error.response?.data?.message || error.message || 'Unhandled Exception';

    const responseError: ErrorResponse = {
      status,
      title,
      detail,
      timestamp: new Date().toISOString(),
    };

    this.logError(error, context.getRequest(), responseError);
    response.status(responseError.status).send(responseError);
  }
}
