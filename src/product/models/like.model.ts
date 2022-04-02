import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { Product } from './product.model';

@ObjectType()
export class Like {
  @Field()
  id: string;

  @Field()
  like: boolean;

  @Field((type) => [User])
  user: User[];

  @Field((type) => [Product])
  product: Product[];
}
