import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { PaginationRequestDto } from './dto/request/pagination-request.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { ListProductsPaginationDto } from './dto/response/list-products-pagination.dto';
import { ResponseProductDto } from './dto/response/response-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ResponseProductDto> {
    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
      },
    });
    return plainToInstance(ResponseProductDto, product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ResponseProductDto> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: { ...updateProductDto },
      });

      return plainToInstance(ResponseProductDto, product);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      throw error;
    }
  }

  async updateVisibility(
    id: string,
    visible: boolean,
  ): Promise<ResponseProductDto> {
    try {
      const productUpdated = await this.prisma.product.update({
        where: { id },
        data: { visible },
      });

      return plainToInstance(ResponseProductDto, productUpdated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      throw error;
    }
  }

  async findOne(id: string): Promise<ResponseProductDto> {
    const productFound = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!productFound) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return plainToInstance(ResponseProductDto, productFound);
  }

  async filterByCategory(category: string): Promise<Product[]> {
    const listProducts = await this.prisma.product.findMany({
      where: { category, visible: true },
    });
    if (!listProducts.length) {
      throw new HttpException(
        'There are no products for this category',
        HttpStatus.NOT_FOUND,
      );
    }
    return listProducts;
  }

  async findAll(
    paginationRequestDto: PaginationRequestDto,
  ): Promise<ListProductsPaginationDto> {
    try {
      const { page, take } = paginationRequestDto;

      const countProducts = await this.prisma.product.count({});

      const pageNro = page * 1;
      const takeNro = take * 1;
      const totalPages = Math.ceil(countProducts / takeNro);
      if (pageNro > totalPages) {
        throw new HttpException(
          'Pages limit exceeded',
          HttpStatus.LENGTH_REQUIRED,
        );
      }
      const products = await this.prisma.product.findMany({
        skip: takeNro * (pageNro - 1),
        take: takeNro,
        select: {
          description: true,
          category: true,
          price: true,
          image: true,
          stock: true,
          id: true,
          visible: true,
        },
      });

      const nextPage = pageNro === totalPages ? null : pageNro + 1;
      const previousPage = pageNro === 1 ? null : pageNro - 1;

      return plainToInstance(ListProductsPaginationDto, {
        products,
        pagination: {
          totalPages,
          itemsPerPage: takeNro,
          totalItems: countProducts,
          currentPage: pageNro,
          nextPage,
          previousPage,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
