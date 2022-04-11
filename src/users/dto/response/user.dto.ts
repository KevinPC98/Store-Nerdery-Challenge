import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

@Exclude()
export class UserDto {
  @Expose()
  @IsString()
  readonly id: string;

  @Expose()
  @IsString()
  readonly name: string;

  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsString()
  readonly password: string;
}
