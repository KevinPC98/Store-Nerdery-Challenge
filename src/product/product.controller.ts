import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/utils/enums';
import { ResponseProductDto } from './dto/response/response-product.dto';
import { UpdateVisibilityDto } from './dto/request/update-visible.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  //@Roles(Role.manager)
  create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ResponseProductDto> {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }

  @Patch('/:id/visible')
  updateVisibility(
    @Param('id') id: string,
    @Body() updateVisibilityDto: UpdateVisibilityDto,
  ): Promise<void> {
    return this.productService.updateVisibility(
      id,
      updateVisibilityDto.visible,
    );
  }

  /*   @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }


  } */
}
