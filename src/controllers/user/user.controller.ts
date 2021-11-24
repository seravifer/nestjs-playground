import { AuthGuard, UserId } from '../../utils/auth.guard';
import { userSchema } from "./user.schema";
import { Validate } from "../../utils/validator.pipe";
import {
  Controller,
  Get,
  UseGuards,
  Put,
  BadRequestException,
  Body,
} from "@nestjs/common";
import { User } from "../../entities/user.entity";
import { IUser } from './user.model';

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
  async updateUser(@UserId() userId: string, @Body() body: IUser) {
    const user = await User.findOne(userId, { select: ["id"] });
    if (!user) return new BadRequestException("USER_NOT_FOUND");
    await User.update(user, body);
  }
}
