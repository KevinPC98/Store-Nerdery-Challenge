import { Field, ObjectType } from '@nestjs/graphql';
import { Cart } from '../../carts/models/cart.model';
import { Token } from '../../auth/models/token.model';
import { Like } from '../../products/models/like.model';

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

  @Field(() => Token)
  contain: Token;

  @Field(() => Like)
  like: Like;

  @Field(() => Cart)
  cart: Cart;
}
