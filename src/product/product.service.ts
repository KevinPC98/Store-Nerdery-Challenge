import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
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
      const product = await this.prisma.product.upsert({
        where: { id },
        update: { ...updateProductDto },
        create: { ...plainToInstance(CreateProductDto, updateProductDto) },
      });

      return plainToInstance(ResponseProductDto, product);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      throw error;
    }
  }

  async updateVisibility(id: string, visible: boolean): Promise<void> {
    try {
      await this.prisma.product.update({
        where: { id },
        data: { visible },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      throw error;
    }
  }
}
