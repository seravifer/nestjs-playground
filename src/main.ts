import { config } from './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(config.cors);
  app.use(cookieParser());
  app.use(csurf());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
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