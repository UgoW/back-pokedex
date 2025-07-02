import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login_user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

/**
 * AuthController handles user authentication endpoints such as registration, login, and profile retrieval.
 */
@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user.
   * @param createUserDto Data Transfer Object containing username and password.
   * @returns The created user (id and username).
   */
  @Post('register')
  @ApiBody({
    type: CreateUserDto,
    examples: {
      exemple: {
        summary: 'Example registration',
        value: { username: 'pikachu', password: 'motdepasse123' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
    schema: {
      example: { id: 1, username: 'pikachu' },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    // Calls the AuthService to register a new user
    return this.authService.register(
      createUserDto.username,
      createUserDto.password,
    );
  }

  /**
   * Log in an existing user.
   * @param loginUserDto Data Transfer Object containing username and password.
   * @returns A JWT token and user information.
   * @throws UnauthorizedException if credentials are invalid.
   */
  @Post('login')
  @ApiBody({
    type: LoginUserDto,
    examples: {
      exemple: {
        summary: 'Example login',
        value: { username: 'pikachu', password: 'motdepasse123' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'JWT token returned',
    schema: {
      example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    },
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    // Validates user credentials
    const user = await this.authService.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    if (!user) {
      // Throws if credentials are invalid
      throw new UnauthorizedException('Invalid credentials');
    }
    // Generates a JWT token for the authenticated user
    let access_token = await this.authService.login(user);
    return {
      access_token: access_token,
      user: { username: user.username, userId: user.id },
    };
  }

  /**
   * Get the profile of the authenticated user.
   * Protected by JWT guard.
   * @param req Request containing the authenticated user.
   * @returns The user's profile information (userId and username).
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponse({
    status: 201,
    description: 'User profile',
    schema: {
      example: {
        userId: 1,
        username: 'pikachu',
      },
    },
  })
  getProfile(@Request() req) {
    // Returns user info extracted from JWT token
    const { userId, username } = req.user;
    return { userId, username };
  }
}
