import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiQuery, ApiTags, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, DocumentBuilder } from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { SearchDto } from './dto/search.dto';
import { SearchTypeDto } from './dto/search-type.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@ApiTags('pokemons')
@ApiBearerAuth()
@Controller('pokemons')
export class PokemonController {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly usersService: UsersService,
  ) {}

  @Get('search')
  @ApiQuery({ name: 'name', required: true, description: 'Nom du Pokémon à rechercher', example: 'Pikachu' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des pokémons correspondant au nom',
    schema: {
      example: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        pokemons: [
          { id: 25, nom: 'Pikachu', type: ['Électrik'] },
        ],
      },
    },
  })
  async searchByName(@Query() query: SearchDto & PaginationDto) {
    return this.pokemonService.searchByNamePaginated(query.name, query.page, query.limit);
  }

  @Get('search-by-type')
  @ApiQuery({ name: 'type', required: true, description: 'Type du Pokémon (ex: Feu, Eau)', example: 'Feu' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des pokémons du type demandé',
    schema: {
      example: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        pokemons: [
          { id: 4, nom: 'Salamèche', type: ['Feu'] },
        ],
      },
    },
  })
  async searchByType(@Query() query: SearchTypeDto & PaginationDto) {
    return this.pokemonService.searchByTypePaginated(query.type, query.page, query.limit);
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
          { id: 1, nom: 'Bulbizarre', type: ['Plante', 'Poison'] },
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
      example: { id: 25, nom: 'Pikachu', type: ['Électrik'], isFavori: false },
    },
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const pokemon = await this.pokemonService.findOne(id);
    let isFavori = false;

    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
        const payload: any = jwtService.verify(token);
        const user = await this.usersService.findById(payload.sub);
        if (user && user.favoris.some(p => Number(p.id) === Number(id))) {
          isFavori = true;
        }
      } catch (e) {
        // Token invalide, on ignore
      }
    }

    return { ...pokemon, isFavori };
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
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Pokémon créé',
    schema: {
      example: { id: 393, nom: 'Tiplouf', type: ['Eau'] },
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

const config = new DocumentBuilder()
  .setTitle('Pokedex API')
  .setDescription('API pour les pokémons')
  .setVersion('1.0')
  .addBearerAuth() 
  .build();
