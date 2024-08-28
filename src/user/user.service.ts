import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const saltOrRound = 10;
    const hashPassword = await bcrypt.hash(data.password, saltOrRound);

    const findUser = await this.prisma.user.findUnique({
      where: { userName: data.userName },
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
}
