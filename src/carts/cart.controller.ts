import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '../auth/utils/enums';
import { CartService } from './cart.service';
import { CartInput } from './dto/input/cart.input';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/:id')
  @Roles(Role.client)
  pickProducts(
    @GetUser() user: User,
    @Param('id') productId: string,
    @Body('quantity') cartInput: CartInput,
  ) {
    return this.cartService.pickProducts(user.id, productId, cartInput);
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
