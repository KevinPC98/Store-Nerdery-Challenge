import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
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
      id: user.id,
      role: user.role,
    };
  }
}
