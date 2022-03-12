import { Expose, Exclude } from 'class-transformer';
import { ResponseProductDto } from './response-product.dto';

@Exclude()
export class ListProductsPaginationDto {
  @Expose()
  readonly products: ResponseProductDto[];

  @Expose()
  readonly pagination: {
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
  };
}
