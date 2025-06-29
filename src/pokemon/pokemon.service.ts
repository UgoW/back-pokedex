import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from './dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const skip = (page - 1) * limit;

    const [pokemons, total] = await this.pokemonRepository.findAndCount({
      take: limit,
      skip,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems: total,
      pokemons,
    };
  }

  findOne(id: number): Promise<Pokemon | null> {
    // Maybe modify null return ?
    return this.pokemonRepository.findOneBy({ id });
  }

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon | null> {
    const pokemon = this.pokemonRepository.create(createPokemonDto);
    return this.pokemonRepository.save(pokemon);
  }

  async remove(id: number): Promise<void> {
    const result = await this.pokemonRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
  }
}
