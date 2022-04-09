import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesService } from '../images/images.service';
import { ConfigService } from '@nestjs/config';
import { ProductResolver } from './resolvers/product.resolver';

@Module({
  imports: [AuthModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    ImagesService,
    ConfigService,
    ProductResolver,
  ],
})
export class ProductModule {}
