import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): UserDto {
    const user = this.userService.getUser(id);

    const userDto = plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });

    return userDto;
  }

  @Get()
  async getUser(): Promise<UserDto[]> {
    const users = await this.userService.getAllUser();

    return users.map((user) =>
      plainToClass(UserDto, user, { excludeExtraneousValues: true }),
    );
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.userService.updateUser(id, updateUserDto);

    const userDto = plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
    return userDto;
  }

  @Delete(':id')
  async deletecUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.userService.deleteUser(id);
  }
}
