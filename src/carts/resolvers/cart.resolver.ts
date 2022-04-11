import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '../../utils/enums';
import { Roles } from '../../auth/guards/roles.decorator';
import { CartService } from '../cart.service';
import { Cart } from '../models/cart.model';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { CartInput } from '../dto/input/cart.input';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private cartService: CartService) {}

  @Roles(Role.client)
  @Mutation(() => Cart)
  pickProducts(
    @GetUser() user: User,
    @Args('id') productId: string,
    @Args('CartInput') cartInput: CartInput,
  ) {
    return this.cartService.pickProducts(user.id, productId, cartInput);
  }

  @Roles(Role.client)
  @Query(() => Cart)
  getCart(@GetUser() user: User, @Args('id') cartId: string) {
    return this.cartService.getCart(cartId);
  }

  @Mutation(() => Cart)
  @Roles(Role.client)
  buyCart(@GetUser() user: User, @Args('id') cartId: string) {
    return this.cartService.buyCart(cartId);
  }
}
