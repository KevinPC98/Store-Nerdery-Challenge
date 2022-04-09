import { Field, Int, Float, ObjectType } from '@nestjs/graphql';

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

  @Field(() => Float)
  price: number;

  @Field()
  image: string;

  @Field()
  visible: boolean;

  @Field(() => Int)
  stock: number;
}
