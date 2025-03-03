import { Logger } from '@nestjs/common';
import { Request } from 'express';

export interface ErrorResponse {
  status: number;
  title: string;
  detail: string;
  meta?: { params: Record<string, any>; body: Record<string, any> };
  timestamp: string;
}

export class BaseExceptionFilter {
  protected readonly logger: Logger = new Logger(this.constructor.name);

  protected logError(error: Error, request: Request, responseError: ErrorResponse) {
    const { name, constructor, stack } = error;
    const { status, detail, meta } = responseError;

    this.logger.error(
      JSON.stringify({
        name,
        kind: constructor?.name,
        detail,
        meta,
        stack,
        status,
        path: request.url,
      })
    );
  }
}
