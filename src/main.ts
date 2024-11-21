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

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .addBearerAuth()
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
