import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { Contain } from '../../product/models/contain.model';

@ObjectType()
export class Cart {
  @Field()
  id: string;

  @Field((type) => [User], {
    nullable: 'items',
  })
  user: User[];

  @Field()
  wasBought: boolean;

  @Field((type) => Contain)
  contain: Contain;
}
