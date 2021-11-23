import { userSchema } from "./../schemas/user.schema";
import { Validate } from "../utils/validator.pipe";
import {
  Controller,
  Req,
  Get,
  UseGuards,
  Put,
  BadRequestException,
  Body,
} from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../entities/user";

@Controller("user")
@UseGuards(AuthGuard())
export class UserController {
  @Get()
  async getUser(@Req() req: Request) {
    return User.findOne(req.user?.userId, {
      select: [
        "id",
        "firstName",
        "lastName",
        "email",
        "birthdate",
        "prefixPhone",
        "phone",
      ],
    });
  }

  @Put()
  @Validate(userSchema)
  async updateUser(@Body() body: any, @Req() req: Request) {
    const user = await User.findOne(req.user?.userId, { select: ["id"] });
    if (!user) return new BadRequestException("USER_NOT_FOUND");
    await User.update(user, body);
  }
}
