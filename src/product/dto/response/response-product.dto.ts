import { PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsDateString, IsString } from 'class-validator';
import { CreateProductDto } from '../request/create-product.dto';

@Exclude()
export class ResponseProductDto extends PickType(CreateProductDto, [
  'description',
  'category',
  'price',
  'image',
  'stock',
]) {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsBoolean()
  readonly visible: boolean;

  @Expose()
  @IsDateString()
  readonly createdAt: string;

  @Expose()
  @IsDateString()
  readonly updatedAt: string;
}
