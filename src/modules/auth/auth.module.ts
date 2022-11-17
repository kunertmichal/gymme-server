import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    UserService,
    UserRepository,
    PrismaService,
  ],
})
export class AuthModule {}
