import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { LoggingService } from '../../shared/logging/logging.service'

interface HttpErrorResponse {
  message?: string | string[]
  error?: string
}

function isHttpErrorResponse(obj: unknown): obj is HttpErrorResponse {
  return typeof obj === 'object' && obj !== null
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let statusCode: number
    let message: string
    let error: string

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      const errorResponse = exception.getResponse()

      if (isHttpErrorResponse(errorResponse)) {
        message = Array.isArray(errorResponse.message)
          ? errorResponse.message[0]
          : errorResponse.message ?? exception.message

        error = errorResponse.error ?? 'Error'
      } else {
        message = exception.message
        error = 'Error'
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Internal server error'
      error = 'Internal Server Error'
    }
    this.loggingService.error(
      `${request.method} ${request.url} - ${statusCode}: ${message}`,
      exception instanceof Error ? exception.stack : 'No stack trace available',
      'ExceptionFilter',
    )

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message,
    })
  }
}
