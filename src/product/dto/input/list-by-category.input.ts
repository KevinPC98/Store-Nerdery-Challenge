import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ListByCategory {
  @Field()
  @IsNotEmpty()
  category: string;
}
