import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { SearchDto } from './dto/search.dto';
import { SearchTypeDto } from './dto/search-type.dto';

@ApiTags('pokemons')
@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('search')
  searchByName(@Query() query: SearchDto) {
    return this.pokemonService.searchByName(query.name);
  }

  @Get('search-by-type')
  @ApiQuery({ name: 'type', required: true, description: 'Type du Pokémon (ex: Feu, Eau)' })
  searchByType(@Query() query: SearchTypeDto) {
    return this.pokemonService.searchByType(query.type);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.findOne(id);
  }

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.remove(id);
  }
}
