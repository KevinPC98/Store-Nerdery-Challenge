import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/request/auth-credentials.dto';
import { TokenDto } from './dto/response/token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signin')
  singin(@Body() authCredentialsDto: AuthCredentialsDto): Promise<TokenDto> {
    console.log(authCredentialsDto);
    return this.authService.signIn(authCredentialsDto);
  }
  @Post('/signup')
  singup(@Body() createUserDto: CreateUserDto): Promise<TokenDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get('/signout')
  singout(@Req() req): Promise<void> {
    const token = req.headers.authorization.replace('Bearer ', '');
    return this.authService.singout(token);
  }
}
