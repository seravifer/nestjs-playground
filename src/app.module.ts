import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './middleware/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { DBConfig, JWTConfig } from './config';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(DBConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(JWTConfig),
    Logger
  ],
  controllers: [
    AuthController,
    UserController
  ],
  providers: [
    JwtStrategy,
    AuthService
  ]
})
export class AppModule { }
