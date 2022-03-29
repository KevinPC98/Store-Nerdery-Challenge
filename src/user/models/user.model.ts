import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
import { Cart } from '../../cart/models/cart.model';
import { Token } from '../../auth/models/token.model';
import { Like } from '../../product/models/like.model';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  role: string;

  @Field()
  createdAt: Date;

  @Field((type) => Token)
  contain: Token;

  @Field((type) => Like)
  like: Like;

  @Field((type) => Cart)
  cart: Cart;
}
