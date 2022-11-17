import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUpLocal(authDto: AuthDto): Promise<Tokens> {
    const hashedPassword = await argon2.hash(authDto.password);
    const newUser = await this.userService.create({
      ...authDto,
      password: hashedPassword,
    });
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.saveRefreshToken(newUser, tokens.refresh_token);
    return tokens;
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: 60 * 15,
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async saveRefreshToken(user: User, token: string) {
    const hashedToken = await argon2.hash(token);
    await this.userService.update({ ...user, refreshToken: hashedToken });
  }
}
