import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, private authService: AuthService) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: any) {
    try {
      const { user } = await this.prisma.token.findUnique({
        where: {
          jti: payload.sub,
        },
        select: {
          user: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      });

      return {
        uuid: user.id,
        role: user.role,
      };
    } catch (error) {
      throw new HttpException('token is invalid', HttpStatus.UNAUTHORIZED);
    }
  }
}
