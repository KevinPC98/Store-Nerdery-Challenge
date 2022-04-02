import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/utils/enums';
import { ResponseProductDto } from './dto/response/response-product.dto';
import { UpdateVisibilityDto } from './dto/request/update-visible.dto';
import { Product, User } from '@prisma/client';
import { ListProductsPaginationDto } from './dto/response/list-products-pagination.dto';
import { Public } from '../auth/decorators/public.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateVisibilityInput } from './dto/input/update-visibility.input';
import { UpdateProductInput } from './dto/input/update-product.input';
import { ListByCategory } from './dto/input/list-by-category.input';
import { LikeInput } from './dto/input/like.input';
import { ResponseLikeDto } from './dto/response/response-like.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.manager)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  @Roles(Role.manager)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductInput,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.manager)
  remove(@Param('id') id: string): Promise<boolean> {
    return this.productService.remove(id);
  }

  @Patch('/:id/visible')
  @Roles(Role.manager)
  updateVisibility(
    @Param('id') id: string,
    @Body() updateVisibilityDto: UpdateVisibilityInput,
  ): Promise<ResponseProductDto> {
    return this.productService.updateVisibility(id, updateVisibilityDto);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('category/:category')
  @Public()
  getByCategory(
    @Param('category') category: ListByCategory,
  ): Promise<Product[]> {
    return this.productService.filterByCategory(category);
  }

  @Get()
  @Public()
  findAll(
    @Query('take') take,
    @Query('page') page,
  ): Promise<ListProductsPaginationDto> {
    return this.productService.findAll({ take, page });
  }

  @Post('/:id/like')
  @Roles(Role.client)
  likeProduct(
    @GetUser() user: User,
    @Param('id') productId: string,
    likeInput: LikeInput,
  ): Promise<void> {
    return this.productService.sendALike(user.id, productId, likeInput);
  }

  @Put('/:id/product-image')
  @Roles(Role.manager)
  async uploadImage(
    @Param('id') productId: string,
  ): Promise<ResponseProductDto> {
    return await this.productService.uploadImage(productId);
  }
}
