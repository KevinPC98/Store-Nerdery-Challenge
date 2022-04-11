import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Role } from 'src/auth/utils/enums';

@Exclude()
export class CreateUserDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  readonly password: string;

  @Expose()
  @IsNotEmpty()
  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;
}
