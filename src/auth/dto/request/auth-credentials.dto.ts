import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';

export class AuthCredentialsDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
