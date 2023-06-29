import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUpUser(@Body() signUp: AuthDto) {
    return this.authService.signup(signUp);
  }

  @Post('login')
  loginUser(@Body() loginDTO: LoginDTO){
    return this.authService.login(loginDTO)
  }
}
