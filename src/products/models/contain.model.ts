import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Cart } from '../../carts/models/cart.model';
import { Product } from './product.model';

@ObjectType()
export class Contain {
  @Field()
  id: string;

  @Field(() => [Cart], {
    nullable: 'items',
  })
  cart: Cart[];

  @Field(() => [Product], {
    nullable: 'items',
  })
  product: Product[];

  @Field(() => Int)
  quantity: number;
}
