import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class CreateContainDto {
  @Expose()
  @IsString()
  readonly cartId: string;

  @Expose()
  @IsString()
  readonly nameProduct: string;

  @Expose()
  @IsNumber()
  readonly quantity: number;
}
