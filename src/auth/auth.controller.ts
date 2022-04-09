import { Body, Controller, Post, Query, Request } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/request/auth-credentials.dto';
import { TokenDto } from './dto/response/token.dto';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '@prisma/client';
import { ChangePasswordDto } from './dto/request/password.dto';

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

  @Post('/forgot-password')
  forgotPassword(@GetUser() user: User): Promise<void> {
    return this.authService.forgotPassword(user.id);
  }

  @Post('/change-password')
  @Public()
  changePassword(
    @Query('token') token: string,
    @Body() changePassword: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changePassword(token, changePassword);
  }
}
