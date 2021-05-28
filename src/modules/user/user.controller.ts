import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReadUserDto, UpdatedUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':userId')
  // @Roles(RoleType.ADMINISTRATOR)
  // @UseGuards(AuthGuard(), RoleGuard)
  getUser(@Param('userId', ParseIntPipe) userId: number): Promise<ReadUserDto> {
    return this._userService.get(userId);
  }

  @UseGuards(AuthGuard())
  @Get()
  async getUsers(): Promise<ReadUserDto[]> {
    return await this._userService.getAll();
  }

  // @Post()
  // async createUser(@Body() user: User): Promise<User> {
  //   const createUser = await this._userService.create(user);
  //   return createUser;
  // }

  @Patch(':userId')
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() user: UpdatedUserDto,
  ): Promise<ReadUserDto> {
    return await this._userService.update(userId, user);
  }

  @Delete(':userId')
  async deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    return await this._userService.delete(userId);
  }

  @Post('setRole/:userId/:roleId')
  setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<boolean> {
    return this._userService.setRoleToUser(userId, roleId);
  }
}
