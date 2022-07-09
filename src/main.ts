import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser(process.env.JWT_SECRETE || 'thoaiky1992'));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.APP_PORT);
}
bootstrap();
