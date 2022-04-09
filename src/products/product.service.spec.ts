import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product, User } from '@prisma/client';
import { commerce, datatype, internet, lorem, name } from 'faker';
import { Role } from '../utils/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { ProductService } from './product.service';
import { ImagesService } from '../images/images.service';
import { ConfigService } from '@nestjs/config';
import { UpdateVisibilityInput } from './dto/input/update-visibility.input';
import { ListByCategory } from './dto/input/list-by-category.input';
import { LikeInput } from './dto/input/like.input';

describe('ProductService', () => {
  let productService: ProductService;
  let prisma: PrismaService;
  let productCreated: Product;
  let userCreated: User;
  let imagesService: ImagesService;
  let configService: ConfigService;

  const createProductDto: CreateProductDto = {
    description: commerce.productDescription(),
    category: lorem.word(),
    price: datatype.float(),
    image: lorem.word(),
    stock: datatype.number(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, PrismaService, ImagesService, ConfigService],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
    imagesService = module.get<ImagesService>(ImagesService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(imagesService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('create', () => {
    let productCreated;
    afterEach(async () => {
      await prisma.product.delete({
        where: {
          id: productCreated.id,
        },
      });
    });
    it('should create a product', async () => {
      productCreated = await productService.create(createProductDto);

      expect(productCreated).toHaveProperty('id');
      expect(productCreated).toHaveProperty(
        'description',
        createProductDto.description,
      );
      expect(productCreated).toHaveProperty(
        'category',
        createProductDto.category,
      );
      expect(productCreated).toHaveProperty('price', createProductDto.price);
      expect(productCreated).toHaveProperty('image', createProductDto.image);
      expect(productCreated).toHaveProperty('stock', createProductDto.stock);
      expect(productCreated).toHaveProperty('visible', true);
      expect(productCreated).toHaveProperty('updatedAt', expect.any(Date));
      expect(productCreated).toHaveProperty('createdAt', expect.any(Date));
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      productCreated = await prisma.product.create({
        data: {
          ...createProductDto,
        },
      });
    });
    afterEach(async () => {
      await prisma.product.delete({
        where: {
          id: productCreated.id,
        },
      });
    });
    it('should update a product and return it', async () => {
      const updateProductDto: UpdateProductDto = {
        description: commerce.productDescription(),
        category: lorem.word(),
        price: datatype.float(),
        image: lorem.word(),
        stock: datatype.number(),
      };
      const result = await productService.update(
        productCreated.id,
        updateProductDto,
      );

      expect(result).toHaveProperty('category', updateProductDto.category);
      expect(result).toHaveProperty('price', updateProductDto.price);
      expect(result).toHaveProperty('image', updateProductDto.image);
      expect(result).toHaveProperty('stock', updateProductDto.stock);
      expect(result).toHaveProperty('visible', true);
      expect(result).toHaveProperty('updatedAt', expect.any(Date));
      expect(result).toHaveProperty('createdAt', expect.any(Date));
    });

    it('should throw an error if the id from product does not exists', async () => {
      const updateProductDto: UpdateProductDto = {
        description: commerce.productDescription(),
        category: lorem.word(),
        price: datatype.float(),
        image: lorem.word(),
        stock: datatype.number(),
      };

      await expect(
        productService.update(datatype.uuid(), updateProductDto),
      ).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    beforeAll(async () => {
      productCreated = await prisma.product.create({
        data: {
          ...createProductDto,
        },
      });
    });

    it('should delete the product sucessfully', async () => {
      expect(await productService.remove(productCreated.id)).toBeTruthy();
    });

    it('should throw an error if the product does not exists', async () => {
      await expect(productService.remove(datatype.uuid())).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateVisibility', () => {
    beforeEach(async () => {
      productCreated = await prisma.product.create({
        data: {
          ...createProductDto,
        },
      });
    });
    afterEach(async () => {
      await prisma.product.delete({
        where: {
          id: productCreated.id,
        },
      });
    });
    it('should return the product updated with the new value of visible', async () => {
      const visible = datatype.boolean();
      const updateVisibilityDto: UpdateVisibilityInput = {
        visible,
      };
      const result = await productService.updateVisibility(
        productCreated.id,
        updateVisibilityDto,
      );

      expect(result).toHaveProperty('visible', visible);
    });

    it('should throw an error if the id is invalid', async () => {
      const visible = datatype.boolean();
      const updateVisibilityDto: UpdateVisibilityInput = {
        visible,
      };
      await expect(
        productService.updateVisibility(datatype.uuid(), updateVisibilityDto),
      ).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      productCreated = await prisma.product.create({
        data: {
          ...createProductDto,
        },
      });
    });
    afterEach(async () => {
      await prisma.product.delete({
        where: {
          id: productCreated.id,
        },
      });
    });
    it('should throw an error if the id of product does not found', async () => {
      await expect(productService.findOne(datatype.uuid())).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should return the product', async () => {
      const result = await productService.findOne(productCreated.id);

      expect(result).toHaveProperty('category', createProductDto.category);
      expect(result).toHaveProperty('price', createProductDto.price);
      expect(result).toHaveProperty('image', expect.any(String));
      expect(result).toHaveProperty('stock', createProductDto.stock);
      expect(result).toHaveProperty('visible');
      expect(result).toHaveProperty('updatedAt', expect.any(Date));
      expect(result).toHaveProperty('createdAt', expect.any(Date));
    });
  });

  describe('filterByCategory', () => {
    beforeEach(async () => {
      productCreated = await prisma.product.create({
        data: {
          ...createProductDto,
        },
      });
    });
    afterEach(async () => {
      await prisma.product.delete({
        where: {
          id: productCreated.id,
        },
      });
    });
    it('should return a list of elements by category', async () => {
      const listByCategory: ListByCategory = {
        category: productCreated.category,
      };
      const result = await productService.filterByCategory(listByCategory);

      expect(result).toStrictEqual(expect.any(Array));
    });

    it('should throw an error if the category does not exists', async () => {
      const listByCategory: ListByCategory = {
        category: 'category',
      };
      await expect(
        productService.filterByCategory(listByCategory),
      ).rejects.toThrow(
        new HttpException(
          'There are no products for this category',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('findAll', () => {
    const products: Product[] = [];
    beforeAll(async () => {
      for (let i = 0; i < 8; i++) {
        const product = await prisma.product.create({
          data: {
            description: commerce.productDescription(),
            category: lorem.word(),
            price: datatype.float(),
            image: lorem.word(),
            stock: datatype.number(),
          },
        });
        products.push(product);
      }
    });
    afterAll(async () => {
      for (let i = 0; i < products.length; i++) {
        await prisma.product.delete({
          where: {
            id: products[i].id,
          },
        });
      }
    });

    it('should throw an error if the page limit exceeds the number of pages', async () => {
      const take = 100;
      const page = 99;
      await expect(productService.findAll({ take, page })).rejects.toThrow(
        new HttpException('Pages limit exceeded', HttpStatus.LENGTH_REQUIRED),
      );
    });

    it('should throw an error if the page limit exceeds the number of pages', async () => {
      const take = 100;
      const page = 99;
      await expect(productService.findAll({ take, page })).rejects.toThrow(
        new HttpException('Pages limit exceeded', HttpStatus.LENGTH_REQUIRED),
      );
    });

    it('should return a first page of products list', async () => {
      const take = 2;
      const page = 1;
      const result = await productService.findAll({ take, page });
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('pagination');
    });
  });

  describe('sendLike', () => {
    beforeAll(async () => {
      productCreated = await prisma.product.create({
        data: {
          ...createProductDto,
        },
      });

      userCreated = await prisma.user.create({
        data: {
          name: name.firstName(),
          email: internet.email(),
          password: internet.password(),
          role: Role.client,
        },
      });
    });

    it('should throw an error if the id from user does not exists', async () => {
      const likeInput: LikeInput = {
        like: true,
      };
      await expect(
        productService.sendLike(datatype.uuid(), productCreated.id, likeInput),
      ).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if the id from product does not exists', async () => {
      const likeInput: LikeInput = {
        like: true,
      };
      await expect(
        productService.sendLike(userCreated.id, datatype.uuid(), likeInput),
      ).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should return like if the user and product are valids', async () => {
      const likeInput: LikeInput = {
        like: true,
      };
      const result = await productService.sendLike(
        userCreated.id,
        productCreated.id,
        likeInput,
      );

      expect(result).toBeUndefined();
    });
  });

  describe('uploadImage', () => {
    beforeEach(async () => {
      productCreated = await prisma.product.create({
        data: {
          ...createProductDto,
        },
      });
    });
    afterEach(async () => {
      await prisma.product.delete({
        where: {
          id: productCreated.id,
        },
      });
    });
    it('should throw an error if the product does not exist', async () => {
      await expect(
        productService.uploadImage('1c2s5s6sa-4a7s4'),
      ).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
    it('should return a product with a presigned url if the product is valid', async () => {
      const result = await productService.uploadImage(productCreated.id);

      expect(result).toHaveProperty('category', createProductDto.category);
      expect(result).toHaveProperty('price', createProductDto.price);
      expect(result).toHaveProperty('image', expect.any(String));
      expect(result).toHaveProperty('stock', createProductDto.stock);
      expect(result).toHaveProperty('visible');
      expect(result).toHaveProperty('updatedAt', expect.any(Date));
      expect(result).toHaveProperty('createdAt', expect.any(Date));
    });
  });
});
