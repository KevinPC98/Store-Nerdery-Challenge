import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { LikeService } from './like/like.service';
import { ProductController } from './product/product.controller';
import { LikeController } from './like/like.controller';
import { ProductService } from './product/product.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController, ProductController, LikeController],
  providers: [AppService, AuthService, LikeService, ProductService],
})
export class AppModule {}
