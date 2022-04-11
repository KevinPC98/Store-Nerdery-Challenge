import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hashSync } from 'bcryptjs';
import { name, internet, datatype } from 'faker';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { Role } from './utils/enums';

describe('AuthService', () => {
  let prisma: PrismaService;
  let authService: AuthService;
  let userService: UserService;
  let userCreated: User;
  const password = internet.password();
  const createUserDto: CreateUserDto = {
    name: name.firstName(),
    email: internet.email(),
    password: hashSync(password, 10),
    role: Role.client,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, PrismaService, UserService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });
  describe('signIn', () => {
    beforeAll(async () => {
      userCreated = await prisma.user.create({
        data: {
          ...createUserDto,
        },
      });
    });

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

    it('should return an access token if the credentials are valids', async () => {
      const result = await authService.signIn({
        email: userCreated.email,
        password,
      });

      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('signUp', () => {
    it('should return a token if the data from user is valid', async () => {
      const result = await authService.signUp({
        name: name.firstName(),
        email: internet.email(),
        password,
        role: Role.client,
      });
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

  describe('singout', () => {
    it('should delete token from session', async () => {
      const token = await authService.signIn({
        email: userCreated.email,
        password,
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
