// src/auth/auth.controller.ts
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

@ApiTags('auth')
@ApiBearerAuth() // Ajoute ceci ici pour toutes les routes du contrôleur
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({
    type: CreateUserDto,
    examples: {
      exemple: {
        summary: 'Exemple de création',
        value: { username: 'pikachu', password: 'motdepasse123' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé',
    schema: {
      example: { id: 1, username: 'pikachu' },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(
      createUserDto.username,
      createUserDto.password,
    );
  }

  @Post('login')
  @ApiBody({
    type: LoginUserDto,
    examples: {
      exemple: {
        summary: 'Exemple de connexion',
        value: { username: 'pikachu', password: 'motdepasse123' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Token JWT retourné',
    schema: {
      example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    },
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    let access_token = await this.authService.login(user);
    return { access_token: access_token, user :{ username: user.username, userId: user.id } };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponse({
    status: 201,
    description: 'Profil utilisateur',
    schema: {
      example: {
        userId: 1,
        username: 'pikachu'
      },
    },
  })
  getProfile(@Request() req) {
    const { userId, username } = req.user;
    return { userId, username };
  }
}
