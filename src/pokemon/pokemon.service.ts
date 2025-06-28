import { Injectable } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PokemonService {
  constructor(
     @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}
  

  create(createPokemonDto: CreatePokemonDto) {
    const pokemon = this.pokemonRepository.create(createPokemonDto);
    return this.pokemonRepository.save(pokemon);
  }

  findAll() {
    return this.pokemonRepository.find();
  }

  findOne(id: number) {
    return this.pokemonRepository.findOneBy({ id });
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonRepository.update(id, updatePokemonDto);
  }

  remove(id: number) {
    return this.pokemonRepository.delete(id);
  }
}
