import { AuthGuard, UserId } from './../utils/auth.guard';
import { userSchema } from "./../schemas/user.schema";
import { Validate } from "../utils/validator.pipe";
import {
  Controller,
  Get,
  UseGuards,
  Put,
  BadRequestException,
  Body,
} from "@nestjs/common";
import { User } from "../entities/user";

@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
  @Get()
  async getUser(@UserId() id: string) {
    return User.findOne(id, {
      select: [
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
  async updateUser(@Body() body: any, @UserId() userId: string) {
    const user = await User.findOne(userId, { select: ["id"] });
    if (!user) return new BadRequestException("USER_NOT_FOUND");
    await User.update(user, body);
  }
}
