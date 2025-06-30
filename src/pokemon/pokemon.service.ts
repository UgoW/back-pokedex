import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
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
    const limit = Number(paginationDto.limit) || 10;
    const page = Number(paginationDto.page) || 1;
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
  
  findOne(id: number): Promise<Pokemon | null> { // Maybe modify null return ?
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

  async searchByName(name: string): Promise<Pokemon[]> {
  if (!name) return [];

  return this.pokemonRepository.find({
    where: {
nom: Raw(
      alias => `${alias} COLLATE utf8mb4_unicode_ci LIKE :name`,
      { name: `%${name}%` }
    )

      },
    });
  }
  
}
