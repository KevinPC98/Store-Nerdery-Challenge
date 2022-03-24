import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class ImagesService {
  constructor(private configService: ConfigService) {}

  async uploadPublicFile(filename: string) {
    const s3 = new S3();

    return s3.getSignedUrlPromise('putObject', {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: `${filename}.png`,
      Expires: parseInt(this.configService.get('AWS_EXPIRE_TIME'), 10),
      ContentType: 'image/png',
    });
  }

  public async generatePresignedUrl(key: string) {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: `${key}.png`,
      Expires: parseInt(this.configService.get('AWS_EXPIRE_TIME'), 10),
    });
  }
}
