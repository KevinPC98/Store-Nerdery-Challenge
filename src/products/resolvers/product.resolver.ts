import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '../../utils/enums';
import { Roles } from '../../auth/roles/roles.decorator';
import { Product } from '../models/product.model';
import { ProductService } from '../product.service';
import { ProductInput } from '../dto/input/create-product.input';
import { UpdateProductInput } from '../dto/input/update-product.input';
import { UpdateVisibilityInput } from '../dto/input/update-visibility.input';
import { ListByCategory } from '../dto/input/list-by-category.input';
import { Public } from '../../auth/decorators/public.decorator';
import { PaginationInput } from '../dto/input/pagination-products.input';
import { LikeInput } from '../dto/input/like.input';
import { GqlJwtGuard } from '../../auth/strategy/gql-jwt.guard';
import { GqlRolesGuard } from '../../auth/roles/gql-role.guard';
import { UseGuards } from '@nestjs/common';
import { GqlGetUser } from '../../auth/roles/gql-get-user.decorator';
import { Message } from '../models/message.model';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Public()
  @Query(() => Product)
  getProduct(@Args('id') id: string) {
    return this.productService.findOne(id);
  }

  @Public()
  @Mutation(() => Product)
  productCreate(@Args('productInput') productInput: ProductInput) {
    return this.productService.create(productInput);
  }

  @Public()
  @Mutation(() => Product)
  productUpdate(
    @Args('id') id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update(id, updateProductInput);
  }

  @Public()
  @Mutation(() => Product)
  visibilityUpdate(
    @Args('id') id: string,
    @Args('UpdateVisibilityInput') updateVisibilityInput: UpdateVisibilityInput,
  ) {
    return this.productService.updateVisibility(id, updateVisibilityInput);
  }

  @Public()
  @Query(() => [Product])
  getByCategory(@Args('ListByCategory') listByCategory: ListByCategory) {
    return this.productService.filterByCategory(listByCategory);
  }

  @Public()
  @Query(() => Product)
  getAll(@Args('PaginationInput') paginationInput: PaginationInput) {
    return this.productService.findAll(paginationInput);
  }

  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  @Roles(Role.client)
  @Mutation(() => Message)
  likeProduct(
    @GqlGetUser() user,
    @Args('id') productId: string,
    @Args('LikeInput') likeInput: LikeInput,
  ) {
    this.productService.sendLike(user.id, productId, likeInput);
    return {
      message: 'Create a like',
    };
  }
}
