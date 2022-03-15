import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductDetailsDto } from '../product/dto/product-details.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CartDto } from './dto/response/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async pickProducts(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartDto> {
    const productFound = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        description: true,
        price: true,
        stock: true,
      },
    });

    if (!productFound) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (quantity > productFound.stock) {
      throw new HttpException('Exceeded stock', HttpStatus.NOT_ACCEPTABLE);
    }

    const remainingAmount = productFound.stock - quantity;

    try {
      let cart = await this.prisma.cart.findFirst({
        where: { userId, wasBoght: false },
      });
      await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          stock: remainingAmount,
        },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({ data: { userId } });
      } else {
        const containFound = await this.prisma.contain.findFirst({
          where: { productId, cartId: cart.id },
        });

        if (containFound) {
          quantity += containFound.quantity;
          await this.prisma.contain.update({
            where: { id: containFound.id },
            data: { cartId: cart.id, productId, quantity },
          });

          const orderDetail = await this.prisma.contain.findMany({
            where: {
              cartId: cart.id,
            },
            select: {
              quantity: true,
              product: {
                select: {
                  description: true,
                  price: true,
                },
              },
            },
          });

          console.log(orderDetail);

          return plainToInstance(CartDto, {
            id: cart.id,
            products: plainToInstance(ProductDetailsDto, orderDetail),
          });
        }
      }

      await this.prisma.contain.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });

      const orderDetail = await this.prisma.contain.findMany({
        where: {
          cartId: cart.id,
        },
        select: {
          quantity: true,
          product: {
            select: {
              description: true,
              price: true,
            },
          },
        },
      });

      return plainToInstance(CartDto, {
        id: cart.id,
        products: plainToInstance(ProductDetailsDto, orderDetail),
      });
    } catch (error) {
      throw error;
    }
  }
}
