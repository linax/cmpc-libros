import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret:
    process.env.JWT_SECRET || 'cmpc-libros-jwt-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
}));
