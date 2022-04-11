import { ConflictException, Injectable } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { Role } from '../auth/utils/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UserDto } from './dto/response/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const userFound = await this.findByEmail(createUserDto.email);

    if (userFound) {
      throw new ConflictException('Email does not valid');
    }

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashSync(createUserDto.password, 10),
        role: Role.client,
      },
    });

    return plainToInstance(UserDto, user);
  }

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      rejectOnNotFound: false,
    });

    if (user!) {
      throw new ConflictException('Email does not valid');
    }

    return plainToInstance(UserDto, user);
  }
}
