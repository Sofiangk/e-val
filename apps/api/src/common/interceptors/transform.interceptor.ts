import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Wraps every successful response in `{ data, meta? }`.
 * Controllers that already return `{ data, meta }` (paginated endpoints) pass
 * through untouched.
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload) => {
        if (
          payload !== null &&
          typeof payload === 'object' &&
          'data' in payload &&
          'meta' in payload
        ) {
          return payload;
        }
        return { data: payload };
      }),
    );
  }
}
