import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hashSync } from 'bcryptjs';
import { name, internet, datatype, lorem } from 'faker';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('AuthService', () => {
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
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, PrismaService, UserService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
  });
  beforeAll(async () => {
    userCreated = await prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  });
  describe('signIn', () => {
    it('should throw an error if the email is not valid', async () => {
      await expect(
        authService.signIn({
          email: internet.email(),
          password: internet.password(),
        }),
      ).rejects.toThrow(
        new HttpException('Email does not valid', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw an error if the password is not valid', async () => {
      await expect(
        authService.signIn({
          email: userCreated.email,
          password: internet.password(),
        }),
      ).rejects.toThrow(
        new HttpException('Password is wrong', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should return a token if the credentials are valids', async () => {
      const result = await authService.signIn({
        email: userCreated.email,
        password: userCreated.password,
      });

      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('signUp', () => {
    it('should return a token if the data from user is valid', async () => {
      const result = await authService.signUp(createUserDto);
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('createToken', () => {
    it('should throw an error if the id from user is not valid', async () => {
      await expect(authService.createToken(datatype.string())).rejects.toThrow(
        new HttpException('User no found', HttpStatus.NOT_FOUND),
      );
    });

    it('should return a token record successfully', async () => {
      const result = await authService.createToken(userCreated.id);

      expect(result).toHaveProperty('jti');
    });
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', async () => {
      const value = lorem.word();
      const accessToken = lorem.word();

      jest.spyOn(jwt, 'sign').mockImplementation(jest.fn(() => accessToken));
      const result = authService.generateAccessToken(value);

      expect(result).toHaveProperty('accessToken', accessToken);
    });
  });

  describe('singout', () => {
    afterAll(async () => {
      await prisma.user.delete({
        where: {
          email: userCreated.email,
        },
      });
    });
    it('should delete token from session', async () => {
      const token = await authService.signIn({
        email: userCreated.email,
        password: userCreated.password,
      });

      expect(await authService.singout(token.accessToken)).toBeUndefined();
    });

    it('should throw error if the token is invalid', async () => {
      const token = name.firstName();
      await expect(authService.singout(token)).rejects.toThrow(
        new HttpException('invalidate token', HttpStatus.UNAUTHORIZED),
      );
    });
  });
});
