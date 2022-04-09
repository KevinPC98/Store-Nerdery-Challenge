import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { Contain } from '../../products/models/contain.model';

@ObjectType()
export class Cart {
  @Field()
  id: string;

  @Field(() => [User], {
    nullable: 'items',
  })
  user: User[];

  @Field()
  wasBought: boolean;

  @Field(() => Contain)
  contain: Contain;
}
