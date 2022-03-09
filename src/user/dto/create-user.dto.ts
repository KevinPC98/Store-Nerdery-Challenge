import { Expose, Exclude } from 'class-transformer';
import { IsEmail, /* IsNotEmpty, */ IsString, Length } from 'class-validator';

@Exclude()
export class CreateUserDto {
  @Expose()
  //@IsNotEmpty()
  @IsString()
  readonly name: string;

  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsString()
  @Length(6, 20)
  readonly password: string;

  @Expose()
  @IsString()
  readonly role: string;
}
