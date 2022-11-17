import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@GetCurrentUser('sub') userId: number) {
    return this.userService.findOne({ id: userId });
  }
}
