import { Body, Controller, Post, Request } from '@nestjs/common';
import { Role } from '../utils/enums';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/request/auth-credentials.dto';
import { TokenDto } from './dto/response/token.dto';
import { Roles } from './role/roles.decorator';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signin')
  singin(@Body() authCredentialsDto: AuthCredentialsDto): Promise<TokenDto> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Public()
  @Post('/signup')
  singup(@Body() createUserDto: CreateUserDto): Promise<TokenDto> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signout')
  singout(@Request() req): Promise<void> {
    return this.authService.singout(
      req.headers.authorization.replace('Bearer ', ''),
    );
  }
}
