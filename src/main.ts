import { config } from './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(config.cors);
  app.use(cookieParser());
  await app.listen(config.port);
}
bootstrap();
