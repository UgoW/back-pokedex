import { Injectable } from '@nestjs/common';
import { CreateUserPokemonDto } from './dto/create-user-pokemon.dto';
import { UpdateUserPokemonDto } from './dto/update-user-pokemon.dto';

@Injectable()
export class UserPokemonService {
  create(createUserPokemonDto: CreateUserPokemonDto) {
    return 'This action adds a new userPokemon';
  }

  findAll() {
    return `This action returns all userPokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userPokemon`;
  }

  update(id: number, updateUserPokemonDto: UpdateUserPokemonDto) {
    return `This action updates a #${id} userPokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPokemon`;
  }
}
