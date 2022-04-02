import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartResolver } from './resolvers/cart.resolver';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService, CartResolver],
})
export class CartModule {}
