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
import { ApiQuery, ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
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
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Nom du Pokémon à rechercher',
    example: 'Pikachu',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des pokémons correspondant au nom',
    schema: {
      example: [
        { id: 25, nom: 'Pikachu', type: ['Électrik'], ...{} },
      ],
    },
  })
  searchByName(@Query() query: SearchDto) {
    return this.pokemonService.searchByName(query.name);
  }

  @Get('search-by-type')
  @ApiQuery({
    name: 'type',
    required: true,
    description: 'Type du Pokémon (ex: Feu, Eau)',
    example: 'Feu',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des pokémons du type demandé',
    schema: {
      example: [
        { id: 4, nom: 'Salamèche', type: ['Feu'], ...{} },
      ],
    },
  })
  searchByType(@Query() query: SearchTypeDto) {
    return this.pokemonService.searchByType(query.type);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des pokémons',
    schema: {
      example: {
        currentPage: 1,
        totalPages: 10,
        totalItems: 100,
        pokemons: [
          { id: 1, nom: 'Bulbizarre', type: ['Plante', 'Poison'], ...{} },
        ],
      },
    },
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, example: 25, description: 'ID du Pokémon' })
  @ApiResponse({
    status: 200,
    description: 'Un Pokémon par son ID',
    schema: {
      example: { id: 25, nom: 'Pikachu', type: ['Électrik'], ...{} },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.findOne(id);
  }

  @Post()
  @ApiBody({
    type: CreatePokemonDto,
    examples: {
      exemple: {
        summary: 'Créer un Pokémon',
        value: {
          nom: 'Tiplouf',
          type: ['Eau'],
          espece: 'Pingouin',
          description: 'Un petit pingouin mignon.',
          // ...autres champs nécessaires...
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Pokémon créé',
    schema: {
      example: { id: 393, nom: 'Tiplouf', type: ['Eau'], ...{} },
    },
  })
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true, example: 25, description: 'ID du Pokémon à supprimer' })
  @ApiResponse({
    status: 200,
    description: 'Pokémon supprimé',
    schema: {
      example: { success: true },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.remove(id);
  }
}
