import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/sign-up')
  signUpLocal(@Body() authDto: AuthDto) {
    return this.authService.signUpLocal(authDto);
  }

  signInLocal() {}

  logOut() {}

  refresh() {}
}
