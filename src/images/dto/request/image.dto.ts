import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ImageDto {
  @Expose()
  @IsString()
  readonly filename: string;
}
