import { Field, InputType, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ProductInput {
  @Field()
  @IsNotEmpty()
  readonly description: string;

  @Field()
  @IsNotEmpty()
  readonly category: string;

  @Field(() => Float)
  @IsNotEmpty()
  readonly price: number;

  @Field()
  @IsNotEmpty()
  readonly image: string;

  @Field(() => Int)
  @IsNotEmpty()
  readonly stock: number;
}
