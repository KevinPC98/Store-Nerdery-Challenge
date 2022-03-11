import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

@Exclude()
export class CreateProductDto {
  @Expose()
  @IsString()
  readonly description: string;

  @Expose()
  @IsNumber()
  readonly category: string;

  @Expose()
  @IsNumber()
  readonly price: number;

  @Expose()
  @IsBoolean()
  readonly image: string;

  @Expose()
  @IsNumber()
  readonly stock: number;
}
