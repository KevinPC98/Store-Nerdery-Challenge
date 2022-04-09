import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { ProductOrderDto } from './product-order.dto';

@Exclude()
export class ProductDetailsDto {
  @Expose()
  @IsString()
  readonly product: ProductOrderDto;

  @Expose()
  @IsNumber()
  readonly quantity: number;
}
