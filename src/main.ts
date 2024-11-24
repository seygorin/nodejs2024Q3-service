import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';
import * as dotenv from 'dotenv';
import { LoggingService } from './logging/logging.service';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, loggingService));

  process.on('uncaughtException', (error: Error) => {
    loggingService.error(`Uncaught Exception: ${error.message}`, error.stack, {
      type: 'UncaughtException',
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any) => {
    loggingService.error(`Unhandled Rejection: ${reason}`, reason?.stack, {
      type: 'UnhandledRejection',
    });
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription(
      `
      ## Authentication
      1. Use POST /auth/login to get tokens
      2. Click 'Authorize' button at the top
      3. Enter your access token in format: Bearer <token>
      4. Now you can access protected endpoints
    `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync(
    join(__dirname, '..', 'doc', 'api.json'),
    JSON.stringify(document, null, 2),
  );

  writeFileSync(
    join(__dirname, '..', 'doc', 'api.yaml'),
    yaml.stringify(document),
  );

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
