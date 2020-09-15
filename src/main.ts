import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { User as CustomUser } from './entities/user';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(cookieParser());
  await app.listen(config.port);
}
bootstrap();


// Workaround type https://github.com/DefinitelyTyped/DefinitelyTyped/issues/23976
declare global {
  namespace Express {
      interface User extends CustomUser {}
  }
}