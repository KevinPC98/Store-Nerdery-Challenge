import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ImagesService } from '../images/images.service';
import { PrismaService } from '../prisma/prisma.service';
import { LikeInput } from './dto/input/like.input';
import { ListByCategory } from './dto/input/list-by-category.input';
import { UpdateProductInput } from './dto/input/update-product.input';
import { UpdateVisibilityInput } from './dto/input/update-visibility.input';
import { CreateProductDto } from './dto/request/create-product.dto';
import { PaginationRequestDto } from './dto/request/pagination-request.dto';
import { ListProductsPaginationDto } from './dto/response/list-products-pagination.dto';
import { ResponseProductDto } from './dto/response/response-product.dto';
import { Product } from './models/product.model';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
      },
    });
    return plainToInstance(Product, product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductInput,
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
    updateVisibilityDto: UpdateVisibilityInput,
  ): Promise<ResponseProductDto> {
    try {
      const productUpdated = await this.prisma.product.update({
        where: { id },
        data: { visible: updateVisibilityDto.visible },
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
    productFound.image = await this.imagesService.generatePresignedUrl(id);
    return plainToInstance(ResponseProductDto, productFound);
  }

  async filterByCategory(listByCategory: ListByCategory): Promise<Product[]> {
    const listProducts = await this.prisma.product.findMany({
      where: { category: listByCategory.category, visible: true },
    });
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

  async sendLike(
    userId: string,
    productId: string,
    likeInput: LikeInput,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
      rejectOnNotFound: false,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
      rejectOnNotFound: false,
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    try {
      await this.prisma.like.create({
        data: {
          userId,
          productId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async uploadImage(
    productId: string,
    //imageDto: ImageDto,
  ): Promise<ResponseProductDto> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          id: true,
        },
        rejectOnNotFound: false,
      });

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      const image = await this.imagesService.uploadPublicFile(product.id);

      const productUpdated = await this.prisma.product.update({
        where: { id: product.id },
        data: {
          image,
        },
      });

      return plainToInstance(ResponseProductDto, productUpdated);
    } catch (error) {
      throw error;
    }
  }
}
