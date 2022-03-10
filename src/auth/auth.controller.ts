import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/request/auth-credentials.dto';
import { TokenDto } from './dto/response/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  singin(@Body() authCredentialsDto: AuthCredentialsDto): Promise<TokenDto> {
    console.log(authCredentialsDto);
    return this.authService.signIn(authCredentialsDto);
  }
  @Post('/signup')
  singup(@Body() createUserDto: CreateUserDto): Promise<TokenDto> {
    return this.authService.signUp(createUserDto);
  }

  @Get('/signout')
  singout(@Req() req): Promise<void> {
    const token = req.headers.authorization.replace('Bearer ', '');
    return this.authService.singout(token);
  }
}
