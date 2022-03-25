import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { ConfigService } from '@nestjs/config';
import { name, internet, datatype } from 'faker';

describe('ImagesService', () => {
  let imagesService: ImagesService;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService, ConfigService],
    }).compile();

    imagesService = module.get<ImagesService>(ImagesService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(imagesService).toBeDefined();
  });

  describe('uploadPublicFile', () => {
    it('should return a string data', async () => {
      expect(
        await imagesService.uploadPublicFile(datatype.string()),
      ).toStrictEqual(expect.any(String));
    });

    it('should return a string data', async () => {
      expect(
        await imagesService.generatePresignedUrl(datatype.string()),
      ).toStrictEqual(expect.any(String));
    });
  });
});
