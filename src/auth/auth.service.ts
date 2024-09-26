import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('UnAuthorization');
    }

    const userExist = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!userExist) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: userExist.id,
      email: userExist.email,
    });
  }

  async registerUser(user: CreateUserDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...user,
        },
      });

      return this.generateJwt({
        sub: newUser.id,
        email: newUser.email,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
