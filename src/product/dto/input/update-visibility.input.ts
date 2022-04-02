import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateVisibilityInput {
  @Field()
  @IsOptional()
  visible?: boolean;
}
