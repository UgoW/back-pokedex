// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

/**
 * AuthService provides authentication logic such as validating users,
 * generating JWT tokens, and registering new users.
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user's credentials.
   * @param username The username to validate.
   * @param password The password to validate.
   * @returns The user object without the password if valid, otherwise null.
   */
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    // Compare the provided password with the stored hash
    if (user && (await bcrypt.compare(password, user.password))) {
      // Remove password from the returned user object
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  /**
   * Generates a JWT token for the authenticated user.
   * @param user The user object.
   * @returns A signed JWT token.
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }

  /**
   * Registers a new user.
   * @param username The username for the new user.
   * @param password The password for the new user.
   * @returns The created user object without the password.
   * @throws UnauthorizedException if the username is already taken.
   */
  async register(username: string, password: string) {
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new UnauthorizedException('Username already taken');
    }
    // The password is hashed in the usersService
    const user = await this.usersService.createUser(username, password);
    // Remove password from the returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
