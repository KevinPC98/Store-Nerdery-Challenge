import { Controller, Post, Body, Param } from '@nestjs/common';
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
}
