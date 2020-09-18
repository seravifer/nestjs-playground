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
    refreshTokenExpiration: number | string;
    accessTokenExpiration: number | string;
  };
}

export const config: Config = {
  projectName: 'Server Test',
  version: 1,
  port: +process.env.PORT || 3000,
  database: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST ?? 'localhosdeet',
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'pass',
    database: process.env.DB_NAME ?? 'db',
    entities: ['dist/entities/*{.ts,.js}'],
  },
  smtp: {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: +process.env.SMTP_PORT || 1025,
    secure: (process.env.SMTP_SECURE === 'true') ?? false,
    user: process.env.SMTP_USER ?? 'project.1',
    pass: process.env.SMTP_PASS ?? 'secret.1',
    mail: process.env.SMTP_MAIL ?? 'noreply@mail.com'
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'secret',
    refreshTokenExpiration: '7d',
    accessTokenExpiration: '6h'
  }
};
