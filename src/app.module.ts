import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './middleware/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user.controller';
import { config } from './config';
import { EmailService } from './services/email.service';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.database),
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.register({ secret: config.jwt.secret }),
    Logger
  ],
  controllers: [
    AuthController,
    UserController,
    HealthController
  ],
  providers: [
    JwtStrategy,
    AuthService,
    EmailService
  ]
})
export class AppModule { }
