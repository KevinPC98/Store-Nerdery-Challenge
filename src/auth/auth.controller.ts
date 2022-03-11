import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Role } from '../utils/enums';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/request/auth-credentials.dto';
import { TokenDto } from './dto/response/token.dto';
import { Roles } from './role/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //@Roles(Role.client, Role.manager)
  @Post('/signin')
  singin(@Body() authCredentialsDto: AuthCredentialsDto): Promise<TokenDto> {
    return this.authService.signIn(authCredentialsDto);
  }

  //@Roles(Role.client, Role.manager)
  @Post('/signup')
  singup(@Body() createUserDto: CreateUserDto): Promise<TokenDto> {
    return this.authService.signUp(createUserDto);
  }

  //@Roles(Role.client, Role.manager)
  @Get('/signout')
  singout(@Req() req): Promise<void> {
    const token = req.headers.authorization.replace('Bearer ', '');
    return this.authService.singout(token);
  }
}
