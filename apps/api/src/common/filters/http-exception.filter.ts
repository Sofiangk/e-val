import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/** Uniform error envelope: { statusCode, message, errors? }. */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'object' && body !== null) {
        const { message, errors } = body as {
          message?: string | string[];
          errors?: Record<string, string[]>;
        };
        return res.status(status).json({
          statusCode: status,
          message: Array.isArray(message) ? message.join(', ') : message ?? exception.message,
          ...(errors ? { errors } : {}),
        });
      }
      return res.status(status).json({ statusCode: status, message: String(body) });
    }

    this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
