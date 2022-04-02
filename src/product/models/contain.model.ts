import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Cart } from '../../cart/models/cart.model';
import { Product } from './product.model';

@ObjectType()
export class Contain {
  @Field()
  id: string;

  @Field((type) => [Cart], {
    nullable: 'items',
  })
  cart: Cart[];

  @Field((type) => [Product], {
    nullable: 'items',
  })
  product: Product[];

  @Field((type) => Int)
  quantity: number;
}
