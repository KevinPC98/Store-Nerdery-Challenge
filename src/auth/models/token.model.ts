import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';

@ObjectType()
export class Token {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field(() => [User], {
    nullable: 'items',
  })
  user: User[];

  @Field()
  jti: string;
}
