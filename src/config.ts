import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

interface Config {
  projectName: string;
  version: number;
  port: number;
  database: TypeOrmModuleOptions;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    mail: string;
  };
  jwt: {
    secret: string;
    refreshTokenExpiration: number;
    accessTokenExpiration: number;
  };
  cors: CorsOptions;
}

export const config: Config = {
  projectName: 'Server Test',
  version: 1,
  port: Number(process.env.PORT ?? 3000),
  database: {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? '123456',
    database: process.env.DB_NAME ?? 'demo',
    entities: ['dist/entities/*{.ts,.js}'],
  },
  smtp: {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: (process.env.SMTP_SECURE === 'true') ?? false,
    user: process.env.SMTP_USER ?? 'project.1',
    pass: process.env.SMTP_PASS ?? 'secret.1',
    mail: process.env.SMTP_MAIL ?? 'noreply@mail.com'
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'secret',
    refreshTokenExpiration: 60 * 60 * 24 * 7, // 7 days in seconds
    accessTokenExpiration: 60 * 60 * 6 // 6 hours in seconds
  },
  cors: {
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: true
  }
};
