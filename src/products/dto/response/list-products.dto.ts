import { Product } from '@prisma/client';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class ListProductsDto {
  @Expose()
  readonly products: Product[];
}
