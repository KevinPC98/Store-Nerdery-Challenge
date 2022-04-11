import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { compareSync } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { TokenDto } from './dto/response/token.dto';
import { Token } from '@prisma/client';
import { AuthCredentialsDto } from './dto/request/auth-credentials.dto';
import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { ChangePasswordDto } from './dto/request/password.dto';
import { hashSync } from 'bcryptjs';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<TokenDto> {
    const user = await this.userService.findByEmail(authCredentialsDto.email);

    if (!user) {
      throw new HttpException('Email does not valid', HttpStatus.UNAUTHORIZED);
    }

    const validPassword = compareSync(
      authCredentialsDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new HttpException('Password is wrong', HttpStatus.UNAUTHORIZED);
    }

    const recordToken = await this.createToken(user.id);

    return this.generateAccessToken(recordToken.jti);
  }

  async signUp(createUserDto: CreateUserDto): Promise<TokenDto> {
    const user = await this.userService.createUser(createUserDto);
    const token = await this.createToken(user.id);
    return this.generateAccessToken(token.jti);
  }

  async createToken(id: string): Promise<Token> {
    try {
      const token = await this.prisma.token.create({
        data: {
          userId: id,
        },
      });
      return token;
    } catch (error) {
      throw new HttpException('User no found', HttpStatus.NOT_FOUND);
    }
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
      throw new HttpException('invalidate token', HttpStatus.UNAUTHORIZED);
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

    return { accessToken };
  }

  async forgotPassword(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    const tokenSign = this.generateEmailConfirmationToken(userId);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const msg = {
      to: user.email as string,
      from: process.env.SENDGRID_SENDER_EMAIL as string,
      subject: 'Change Password',
      text: `Here: http://localhost:3000/auth/change-password?token=${tokenSign}`,
      html: `<strong>Token: ${tokenSign}</strong>`,
    };
    await sgMail.send(msg);
    console.log(
      `Here: http://localhost:3000/auth/change-password?token=${tokenSign}`,
    );
  }

  async changePassword(
    token: string,
    changePassword: ChangePasswordDto,
  ): Promise<void> {
    let sub;

    try {
      ({ sub } = verify(
        token,
        process.env.JWT_EMAIL_CONFIRMATION_SECRET_KEY as string,
      ));
    } catch (error) {
      throw new UnprocessableEntityException('Invalid Token');
    }

    const userId = sub;
    const userUpdated = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashSync(changePassword.newPassword, 10),
      },
    });
    console.log(userUpdated);
  }

  generateEmailConfirmationToken(userId: string): string {
    const now = new Date().getTime();
    const exp = Math.floor(
      new Date(now).setSeconds(
        parseInt(
          process.env.JWT_EMAIL_CONFIRMATION_EXPIRATION_TIME as string,
          10,
        ),
      ) / 1000,
    );
    const iat = Math.floor(now / 1000);

    return sign(
      {
        sub: userId,
        iat,
        exp,
      },
      process.env.JWT_EMAIL_CONFIRMATION_SECRET_KEY as string,
    );
  }
}
