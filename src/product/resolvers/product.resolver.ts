import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '../../utils/enums';
import { Roles } from '../../auth/role/roles.decorator';
import { Product } from '../models/product.model';
import { ProductService } from '../product.service';
import { ProductInput } from '../dto/input/create-product.input';
import { UpdateProductInput } from '../dto/input/update-product.input';
import { UpdateVisibilityInput } from '../dto/input/update-visibility.input';
import { ListByCategory } from '../dto/input/list-by-category.input';
import { Public } from '../../auth/decorators/public.decorator';
import { PaginationInput } from '../dto/input/pagination-products.input';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Like } from '../models/like.model';
import { LikeInput } from '../dto/input/like.input';
import { GqlJwtGuard } from '../../auth/strategy/gql-jwt.guard';
import { GqlRolesGuard } from '../../auth/role/gql-role.guard';
import { UseGuards } from '@nestjs/common';
import { ListProductsPagination } from '../models/pagination.model';
import { GqlGetUser } from '../../auth/role/gql-get-user.decorator';
import { User } from '../../user/models/user.model';
import { Message } from '../models/message.model';

@Resolver((of) => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Public()
  @Query((returns) => Product)
  async getProduct(@Args('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Public()
  @Mutation((returns) => Product)
  async productCreate(@Args('productInput') productInput: ProductInput) {
    return await this.productService.create(productInput);
  }

  @Public()
  @Mutation(() => Product)
  async productUpdate(
    @Args('id') id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return await this.productService.update(id, updateProductInput);
  }

  @Public()
  @Mutation(() => Product)
  async visibilityUpdate(
    @Args('id') id: string,
    @Args('UpdateVisibilityInput') updateVisibilityInput: UpdateVisibilityInput,
  ) {
    return await this.productService.updateVisibility(
      id,
      updateVisibilityInput,
    );
  }

  @Public()
  @Query((returns) => [Product])
  async getByCategory(@Args('ListByCategory') listByCategory: ListByCategory) {
    return await this.productService.filterByCategory(listByCategory);
  }

  @Public()
  @Query((returns) => Product)
  async getAll(@Args('PaginationInput') paginationInput: PaginationInput) {
    return await this.productService.findAll(paginationInput);
  }

  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  @Roles(Role.client)
  @Mutation(() => Message)
  likeProduct(
    @GqlGetUser() user,
    @Args('id') productId: string,
    @Args('LikeInput') likeInput: LikeInput,
  ) {
    this.productService.sendALike(user.id, productId, likeInput);
    return {
      message: 'Create a like',
    };
  }
}
