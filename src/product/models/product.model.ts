import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
import { Contain } from './contain.model';
import { Like } from './like.model';

@ObjectType()
export class Product {
  @Field()
  id: string;

  @Field()
  description: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  category: string;

  @Field((type) => Float)
  price: number;

  @Field()
  image: string;

  @Field()
  visible: boolean;

  @Field((type) => Int)
  stock: number;
}
