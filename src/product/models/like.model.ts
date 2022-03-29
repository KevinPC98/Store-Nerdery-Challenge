import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { Product } from './product.model';

@ObjectType()
export class Like {
  @Field()
  id: string;

  @Field((type) => [User], {
    nullable: 'items',
  })
  user: User[];

  @Field((type) => [Product], {
    nullable: 'items',
  })
  product: Product[];
}
