import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { ProductDetailsDto } from 'src/product/dto/product-details.dto';

@Exclude()
export class CartDto {
  @Expose()
  @IsString()
  readonly id: string;

  @Expose()
  @IsString()
  readonly products: ProductDetailsDto[];
}
