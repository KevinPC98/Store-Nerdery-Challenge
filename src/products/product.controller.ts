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
import { Role } from 'src/auth/utils/enums';
import { ResponseProductDto } from './dto/response/response-product.dto';
import { Product, User } from '@prisma/client';
import { ListProductsPaginationDto } from './dto/response/list-products-pagination.dto';
import { Public } from '../auth/decorators/public.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateVisibilityInput } from './dto/input/update-visibility.input';
import { UpdateProductInput } from './dto/input/update-product.input';
import { ListByCategory } from './dto/input/list-by-category.input';
import { LikeInput } from './dto/input/like.input';
import { Roles } from 'src/auth/decorators/roles.decorator';

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
    @Body('like') likeInput: LikeInput,
  ): Promise<void> {
    return this.productService.sendLike(user.id, productId, likeInput);
  }

  @Put('/:id/product-image')
  @Roles(Role.manager)
  async uploadImage(
    @Param('id') productId: string,
  ): Promise<ResponseProductDto> {
    return await this.productService.uploadImage(productId);
  }
}
