import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CartInput {
  @Field(() => Int)
  @IsNotEmpty()
  quantity: number;
}
