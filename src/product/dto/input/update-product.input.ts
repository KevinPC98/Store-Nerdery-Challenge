import { Field, InputType, Float, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateProductInput {
  @Field()
  @IsOptional()
  description?: string;

  @Field()
  @IsOptional()
  category?: string;

  @Field(() => Float)
  @IsOptional()
  price?: number;

  @Field()
  @IsOptional()
  image?: string;

  @Field(() => Int)
  @IsOptional()
  stock?: number;
}
