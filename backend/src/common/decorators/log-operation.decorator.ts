import { SetMetadata } from '@nestjs/common';

export const LogOperation = (operation: string) =>
  SetMetadata('operation', operation);
