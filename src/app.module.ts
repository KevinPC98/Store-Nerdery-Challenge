import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { LikeService } from './like/like.service';
import { ProductController } from './product/product.controller';
import { LikeController } from './like/like.controller';
import { ProductService } from './product/product.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    ProductController,
    LikeController,
    UserController,
  ],
  providers: [
    AppService,
    AuthService,
    LikeService,
    ProductService,
    UserService,
    PrismaService,
  ],
})
export class AppModule {}
