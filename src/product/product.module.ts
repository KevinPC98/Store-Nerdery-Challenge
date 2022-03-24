import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesService } from 'src/images/images.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [AuthModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService, ImagesService, ConfigService],
})
export class ProductModule {}
