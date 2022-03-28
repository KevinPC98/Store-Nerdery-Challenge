import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../utils/enums';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/:id')
  @Roles(Role.client)
  pickProducts(
    @GetUser() user: User,
    @Param('id') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.pickProducts(user.id, productId, quantity);
  }

  @Get('/:id')
  @Roles(Role.client)
  getCart(@GetUser() user: User, @Param('id') cartId: string) {
    return this.cartService.getCart(cartId);
  }

  @Patch('/:id')
  @Roles(Role.client)
  buyCart(@GetUser() user: User, @Param('id') cartId: string) {
    return this.cartService.buyCart(cartId);
  }
}
