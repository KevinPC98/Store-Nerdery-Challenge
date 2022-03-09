import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { UnprocessableEntity, NotFound, Conflict } from 'http-errors';
import { AuthService } from 'src/auth/auth.service';
import { TokenDto } from 'src/auth/dto/response/token.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<TokenDto> {
    const userFound = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
      select: { id: true },
      rejectOnNotFound: false,
    });

    if (userFound) {
      throw new Conflict('Email belong other user');
    }
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashSync(createUserDto.password, 10),
        role: 'C',
      },
    });
    const token = await this.authService.createToken(user.id);
    return this.authService.generateAccessToken(token.jti);
  }
}
