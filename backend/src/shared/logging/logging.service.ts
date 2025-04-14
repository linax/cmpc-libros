import { Injectable, Inject } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Injectable()
export class LoggingService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  log(message: string, context?: string) {
    this.logger.info(message, { context })
  }

  error(message: string, trace: string, context?: string) {
    this.logger.error(`${message} - ${trace}`, { context })
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context })
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context })
  }

  logOperation(operation: string, userId: string, details: any) {
    this.logger.info(`Operation: ${operation}`, {
      operation,
      userId,
      details,
      timestamp: new Date().toISOString(),
      type: 'AUDIT',
    })
  }
}
