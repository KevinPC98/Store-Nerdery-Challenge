import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

@Exclude()
export class PaginationRequestDto {
  @Expose()
  @IsOptional()
  @IsPositive()
  @IsNumber()
  page: number;

  @Expose()
  @IsOptional()
  @IsPositive()
  @IsNumber()
  take: number;
}
