import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const saltOrRound = 10;
    const hashPassword = await bcrypt.hash(data.password, saltOrRound);

    const findUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (findUser != null) {
      throw new BadRequestException('duplicate user name');
    }

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashPassword,
      },
    });
  }

  async getUser(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getAllUser(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const saltOrRound = 10;
    const hashPassword = await bcrypt.hash(updateUserDto.password, saltOrRound);
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: hashPassword,
      },
    });
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw new Error(`Could not delete user with ${error}`);
    }
  }
}
