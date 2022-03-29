import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';

@ObjectType()
export class Token {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field((type) => [User], {
    nullable: 'items',
  })
  user: User[];

  @Field()
  jti: string;
}
