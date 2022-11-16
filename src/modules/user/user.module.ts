import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserRepository, UserService],
  controllers: [UserController],
})
export class UserModule {}
