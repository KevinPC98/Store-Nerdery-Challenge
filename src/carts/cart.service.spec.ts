import { Test, TestingModule } from '@nestjs/testing';
import { Cart, Product, User } from '@prisma/client';
import { CreateProductDto } from '../products/dto/request/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from './cart.service';
import { commerce, datatype, internet, lorem, name } from 'faker';
import { Role } from '../auth/utils/enums';
import { hashSync } from 'bcryptjs';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CartInput } from './dto/input/cart.input';

describe('CartService', () => {
  let cartService: CartService;
  let prisma: PrismaService;
  let userCreated: User;
  let productCreated: Product;
  const password = internet.password();
  const createUserDto: CreateUserDto = {
    name: name.firstName(),
    email: internet.email(),
    password: hashSync(password, 10),
    role: Role.client,
  };
  const createProductDto: CreateProductDto = {
    description: commerce.productDescription(),
    category: lorem.word(),
    price: datatype.float(),
    image: lorem.word(),
    stock: datatype.number(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService, PrismaService],
    }).compile();

    cartService = module.get<CartService>(CartService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(cartService).toBeDefined();
  });

  describe('pickProducts', () => {
    beforeAll(async () => {
      userCreated = await prisma.user.create({
        data: {
          ...createUserDto,
        },
      });
      productCreated = await prisma.product.create({
        data: {
          ...createProductDto,
        },
      });
    });

    it('should throw an error if the product is invalid', async () => {
      const cartInput: CartInput = {
        quantity: 5,
      };
      await expect(
        cartService.pickProducts(userCreated.id, datatype.uuid(), cartInput),
      ).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if the quantity is more than the stock of products', async () => {
      const cartInput: CartInput = {
        quantity: productCreated.stock + 1,
      };
      await expect(
        cartService.pickProducts(userCreated.id, productCreated.id, cartInput),
      ).rejects.toThrow(
        new HttpException('Exceeded stock', HttpStatus.NOT_ACCEPTABLE),
      );
    });

    it('should return details of cart', async () => {
      const cartInput: CartInput = {
        quantity: 1,
      };
      const result = await cartService.pickProducts(
        userCreated.id,
        productCreated.id,
        cartInput,
      );
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('products');
    });
  });

  describe('getCart', () => {
    let cartCreated: Cart;
    beforeAll(async () => {
      userCreated = await prisma.user.create({
        data: {
          name: name.firstName(),
          email: internet.email(),
          password: hashSync(password, 10),
          role: Role.client,
        },
      });

      cartCreated = await prisma.cart.create({
        data: {
          id: datatype.uuid(),
          userId: userCreated.id,
          wasBought: false,
        },
      });
    });

    it('should throw an error if the cart does not exist', async () => {
      await expect(cartService.getCart(datatype.uuid())).rejects.toThrow(
        new HttpException('Cart not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should return the details of cart', async () => {
      const result = await cartService.getCart(cartCreated.id);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('products');
    });
  });

  describe('buyCart', () => {
    let cartCreated: Cart;
    beforeAll(async () => {
      userCreated = await prisma.user.create({
        data: {
          name: name.firstName(),
          email: internet.email(),
          password: hashSync(password, 10),
          role: Role.client,
        },
      });

      cartCreated = await prisma.cart.create({
        data: {
          id: datatype.uuid(),
          userId: userCreated.id,
          wasBought: false,
        },
      });
    });

    it('should throw an error if the cart does not exist', async () => {
      await expect(cartService.getCart(datatype.uuid())).rejects.toThrow(
        new HttpException('Cart not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should update the status of cart', async () => {
      const result = await cartService.buyCart(cartCreated.id);
      expect(result).toBeUndefined();
    });
  });
});
