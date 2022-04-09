import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { Product } from './product.model';

@ObjectType()
export class Like {
  @Field()
  id: string;

  @Field()
  like: boolean;

  @Field(() => [User])
  user: User[];

  @Field(() => [Product])
  product: Product[];
}
