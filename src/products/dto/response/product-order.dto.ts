import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class ProductOrderDto {
  @Expose()
  @IsString()
  readonly description: string;

  @Expose()
  @IsNumber()
  readonly products: number;
}
