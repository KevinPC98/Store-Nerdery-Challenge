import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { Role } from 'src/utils/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userFound = await this.findByEmail(createUserDto.email);

    if (userFound) {
      throw new HttpException('Email does not valid', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashSync(createUserDto.password, 10),
        role: Role.client,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      rejectOnNotFound: false,
    });

    return user;
  }
}
