import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
//import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
//import * as morgan from 'morgan';
//import * as fs from 'fs';
//import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
  .setTitle('Books API')
  .setDescription('API para gestión de libros')
  .setVersion('1.0')
  .addTag('books')
  .addServer('/api')
  .build();

const document = SwaggerModule.createDocument(app, config);

// Swagger at: http://localhost:3000/api-swagger
SwaggerModule.setup('api-swagger', app, document);

  // Get configuration
  const configService = app.get(ConfigService);

  // Use Winston for logging
  //app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Set up Morgan HTTP request logger
  /*const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '../logs/access.log'),
    { flags: 'a' },
  );*/
  //app.use(morgan('combined', { stream: accessLogStream }));

  // Set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors();

  // Set global prefix
  app.setGlobalPrefix('api');

  // Start the server
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
