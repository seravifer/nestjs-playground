import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user/user.controller';
import { config } from './config';
import { EmailService } from './services/email.service';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.database),
    JwtModule.register({ secret: config.jwt.secret }),
    Logger
  ],
  controllers: [
    AuthController,
    UserController,
    HealthController
  ],
  providers: [
    AuthService,
    EmailService
  ]
})
export class AppModule { }
