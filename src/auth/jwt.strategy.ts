import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JwtStrategy defines how JWT tokens are validated and how user data is extracted from the token.
 * It uses the JWT secret from environment variables and expects the token in the Authorization header as a Bearer token.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  /**
   * Validates the JWT payload and attaches user information to the request.
   * @param payload The decoded JWT payload.
   * @returns An object containing userId and username.
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
