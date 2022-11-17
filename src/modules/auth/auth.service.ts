import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { UserService } from '../user/user.service';

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
    await this.saveRefreshToken(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signInLocal(authDto: AuthDto): Promise<Tokens> {
    const foundUser = await this.userService.findOne({ email: authDto.email });
    if (!foundUser) {
      throw new UnauthorizedException();
    }

    const doesPasswordMatch = await argon2.verify(
      foundUser.password,
      authDto.password,
    );
    if (!doesPasswordMatch) {
      throw new UnauthorizedException();
    }

    const tokens = await this.getTokens(foundUser.id, foundUser.email);
    await this.saveRefreshToken(foundUser.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.userService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId, refreshToken) {
    const foundUser = await this.userService.findOne({ id: userId });
    if (!foundUser || !foundUser.refreshToken) {
      console.log(foundUser);
      throw new ForbiddenException();
    }

    const doesRefreshTokenMatch = await argon2.verify(
      foundUser.refreshToken,
      refreshToken,
    );
    if (!doesRefreshTokenMatch) {
      throw new ForbiddenException();
    }

    const tokens = await this.getTokens(userId, foundUser.refreshToken);
    await this.saveRefreshToken(userId, tokens.refresh_token);
    return tokens;
  }

  private async getTokens(userId: number, email: string): Promise<Tokens> {
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

  private async saveRefreshToken(userId: number, token: string) {
    const hashedToken = await argon2.hash(token);
    await this.userService.update(userId, {
      refreshToken: hashedToken,
    });
  }
}
