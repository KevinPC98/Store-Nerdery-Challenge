import { PartialType } from '@nestjs/swagger';
import { CreateContainDto } from './create-contain.dto';

export class UpdateCartDto extends PartialType(CreateContainDto) {}
