import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly loggingService: LoggingService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path, ip, body } = request;
    const user = request.user;
    const userId = user ? user.id : 'anonymous';
    const operation = this.reflector.get<string>(
      'operation',
      context.getHandler(),
    );

    const now = Date.now();
    const message = `${method} ${path}`;

    this.loggingService.log(`Request: ${message}`, 'HTTP');

    return next.handle().pipe(
      tap({
        next: (data) => {
          const delay = Date.now() - now;
          this.loggingService.log(`Response: ${message} ${delay}ms`, 'HTTP');

          if (operation) {
            const operationDetails = {
              method,
              path,
              body: this.sanitizeBody(body),
              ip,
              responseTime: `${delay}ms`,
            };

            this.loggingService.logOperation(
              operation,
              userId,
              operationDetails,
            );
          }
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.loggingService.error(
            `Error on ${message}: ${error.message}`,
            error.stack,
            'HTTP',
          );

          if (operation) {
            const operationDetails = {
              method,
              path,
              body: this.sanitizeBody(body),
              ip,
              error: error.message,
              responseTime: `${delay}ms`,
            };

            this.loggingService.logOperation(
              `${operation}-error`,
              userId,
              operationDetails,
            );
          }
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return {};

    // Create a shallow copy of the body
    const sanitized = { ...body };

    // Remove sensitive information
    if (sanitized.password) sanitized.password = '***';

    return sanitized;
  }
}
