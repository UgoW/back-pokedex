import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * AuthModule is responsible for providing authentication-related dependencies,
 * including JWT configuration, user management, and authentication strategies.
 */
@Module({
  imports: [
    // Loads environment variables and configuration
    ConfigModule.forRoot(), 
    // Imports the UsersModule to manage user data
    UsersModule,
    // Configures the JWT module asynchronously using environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // JWT secret key from environment variables
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          // Token expiration time from environment variables or defaults to 1 hour
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h',
        },
      }),
    }),
  ],
  // Provides authentication service and JWT strategy
  providers: [AuthService, JwtStrategy],
  // Registers the authentication controller
  controllers: [AuthController],
})
export class AuthModule {}
