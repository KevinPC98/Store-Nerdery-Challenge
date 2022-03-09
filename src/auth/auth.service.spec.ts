import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let prisma: PrismaService;
  /*   let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  }); */

  /*   describe('singin', () => {
    beforeAll(async () => {
      const pwd = faker.internet.password();
      await prisma.user.create({
        data: {
          ...user,
          password: hashSync(pwd, 10),
          role: 'C',
        },
      });
    });
    afterAll(async () => {
      await prisma.user.deleteMany();
    });
  }); */
});
