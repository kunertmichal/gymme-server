import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import config from './config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] }), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
