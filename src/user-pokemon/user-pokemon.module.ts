import { Module } from '@nestjs/common';
import { UserPokemonService } from './user-pokemon.service';
import { UserPokemonController } from './user-pokemon.controller';

@Module({
  controllers: [UserPokemonController],
  providers: [UserPokemonService],
})
export class UserPokemonModule {}
