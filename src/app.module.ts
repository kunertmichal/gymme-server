import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import config from './config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] }), UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
