import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int)
  @IsOptional()
  @IsPositive()
  @IsNumber()
  page: number;

  @Field(() => Int)
  @IsOptional()
  @IsPositive()
  @IsNumber()
  take: number;
}
