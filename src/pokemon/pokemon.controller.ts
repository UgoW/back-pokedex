import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PaginationDto } from './dto/pagination.dto';

@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.findOne(id);
  }
}
