import { config } from "./../config";
import { JwtService } from "@nestjs/jwt";
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  createParamDecorator,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from 'express';
import { decode, JwtPayload } from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = getTokenFromHeaders(request);
    if (accessToken) {
      return !!this.jwtService
        .verify(accessToken, {
          ignoreExpiration: false,
          secret: config.jwt.secret,
        });
    }
    return false;
  }
}

function getTokenFromHeaders(req: Request): string | null {
  const authorization = req.headers.authorization;
  if (authorization) {
    return authorization.replace("Bearer ", "");
  }
  return null;
}

export const UserId = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const accessToken = getTokenFromHeaders(request) as string;
    return (decode(accessToken) as JwtPayload).userId;
  }
);
