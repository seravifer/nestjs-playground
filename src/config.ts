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
}

export const config: Config = {
  projectName: 'Server Test',
  version: 1,
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass',
    database: 'db',
    entities: ['dist/entities/*{.ts,.js}'],
  },
  smtp: {
    host: 'localhost',
    port: 1025,
    secure: false,
    user: 'project.1',
    pass: 'secret.1',
    mail: 'noreply@mail.com'
  },
  jwt: {
    secret: 'secret', // FIXME: use env
    refreshTokenExpiration: 3600,
    accessTokenExpiration: 3600
  }
};
