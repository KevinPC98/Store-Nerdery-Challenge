import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { name, internet } from 'faker';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let prisma: PrismaService;
  let authService: AuthService;
  let userService: UserService;
  let userCreated: User;
  const createUserDto: CreateUserDto = {
    name: name.firstName(),
    email: internet.email(),
    password: hashSync(internet.password(), 10),
    role: 'C',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, UserService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  beforeAll(async () => {
    userCreated = await prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  });

  describe('createUser', () => {
    afterEach(async () => {
      await prisma.user.delete({
        where: {
          email: createUserDto.email,
        },
      });
    });

    it('should throw an error if the email form user not exists', async () => {
      await expect(
        authService.signIn({
          email: internet.email(),
          password: internet.password(),
        }),
      ).rejects.toThrow(
        new HttpException('Email does not valid', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should return a token if the user was created succesfully', async () => {
      const result = await authService.signUp(createUserDto);
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('findByEmail', () => {
    it('should return null if the email does not exists', async () => {
      expect(await userService.findByEmail(internet.email())).toBeNull();
    });

    it('should return a user ', async () => {
      const result = await userService.findByEmail(userCreated.email);

      expect(result).toBeDefined();
    });
  });
});
