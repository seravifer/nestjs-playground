import { config } from '@config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import  csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(config.cors);
  app.use(cookieParser());
  // TODO: app.use(csurf());
  // TODO: add rate limiter
  await app.listen(config.port);
}
bootstrap();


// Workaround type https://github.com/DefinitelyTyped/DefinitelyTyped/issues/23976
declare global {
  namespace Express {
      interface User {
        userId: string;
      }
  }
}