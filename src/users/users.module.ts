// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Pokemon, User]),
  ],
  controllers: [UsersController], // UsersController should be added here if it exists
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
