import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { AuthDto } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/sign-up')
  signUpLocal(@Body() authDto: AuthDto) {
    return this.authService.signUpLocal(authDto);
  }

  @Post('local/sign-in')
  signInLocal(@Body() authDto: AuthDto) {
    return this.authService.signInLocal(authDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logOut(@GetCurrentUser('sub') userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh-tokens')
  refreshToken(
    @GetCurrentUser('sub') id: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(id, refreshToken);
  }
}
