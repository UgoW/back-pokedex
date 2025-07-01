// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  
    async validateUser(username: string, password: string) {
      const user = await this.usersService.findByUsername(username);

      // Ici, le user.password doit encore exister pour la comparaison
      if (user && await bcrypt.compare(password, user.password)) {
        // Maintenant qu'on a validé le mot de passe, on enlève le hash
        const { password, ...result } = user;
        return result;
      }

      return null;
    }



  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string) {
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new UnauthorizedException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser(username, hashedPassword);
    return user;
}

}
