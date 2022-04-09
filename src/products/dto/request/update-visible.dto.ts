import { PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ResponseProductDto } from '../response/response-product.dto';

@Exclude()
export class UpdateVisibilityDto extends PickType(ResponseProductDto, [
  'visible',
]) {}
