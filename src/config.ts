import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { JwtModuleOptions } from "@nestjs/jwt";

export const DBConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "pass",
  database: "db",
  entities: ["dist/models/*{.ts,.js}"]
};

export const passwordSecret: string = 'secret';

export const JWTConfig = {
  secret: 'secret',
  signOptions: {
    expiresIn: 3600,
  }
} as JwtModuleOptions;