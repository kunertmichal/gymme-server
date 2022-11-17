import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtPayloadWithRt } from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req
      ?.get('Authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token not provided');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
