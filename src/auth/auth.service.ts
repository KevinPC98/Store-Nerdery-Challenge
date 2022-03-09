import { Injectable } from '@nestjs/common';
import { Unauthorized, NotFound, Conflict } from 'http-errors';
import { PrismaService } from 'src/prisma.service';
import { compareSync } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { TokenDto } from './dto/response/token.dto';
import { Token } from '@prisma/client';
import { AuthCredentialsDto } from './dto/request/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<TokenDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: authCredentialsDto.email,
      },
    });

    if (!user) {
      throw new Unauthorized('User doesnt exist');
    }

    const validPassword = compareSync(
      authCredentialsDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new Unauthorized('Password incorrect');
    }

    const recordToken = await this.createToken(user.id);

    return this.generateAccessToken(recordToken.jti);
  }

  async createToken(id: string): Promise<Token> {
    const token = await this.prisma.token.create({
      data: {
        userId: id,
      },
    });
    return token;
  }

  async singout(token: string): Promise<void> {
    try {
      const jwt = verify(token, process.env.JWT_SECRET_KEY as string);

      await this.prisma.token.delete({
        where: {
          jti: jwt.sub as string,
        },
      });
    } catch (error) {
      throw new Unauthorized('invalidate token');
    }
  }

  generateAccessToken(sub: string): TokenDto {
    const now = new Date().getTime();
    const exp = Math.floor(
      new Date(now).setSeconds(
        parseInt(process.env.JWT_EXPIRATION_TIME as string, 10),
      ) / 1000,
    );
    const iat = Math.floor(now / 1000);

    const accessToken = sign(
      {
        sub,
        iat,
        exp,
      },
      process.env.JWT_SECRET_KEY as string,
    );

    return {
      accessToken,
      exp,
    };
  }
}
