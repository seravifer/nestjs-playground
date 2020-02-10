import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';

interface Config {
  projectName: string;
  version: number;
  port: number;
  database: TypeOrmModuleOptions;
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
    mail: string;
  };
  session: {
    passwordSecret: string;
    jwtConfig: JwtModuleOptions;
  };
}

export const config: Config = {
  projectName: 'Server Test',
  version: 1,
  port: parseInt(process.env.APP_PORT, 10) || 3000,
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
    host: '',
    port: 0,
    user: '',
    pass: '',
    mail: '',
  },
  session: {
    passwordSecret: 'secret',
    jwtConfig: {
      secret: 'secret',
      signOptions: {
        expiresIn: 3600,
      }
    }
  }
};
