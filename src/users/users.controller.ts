import { Controller, UseGuards, Post, Delete, Get, Param, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('favoris/:pokemonId')
  @ApiParam({ name: 'pokemonId', required: true, example: 25, description: 'ID du Pokémon à ajouter en favori' })
  @ApiResponse({
    status: 201,
    description: 'Liste des favoris après ajout',
    schema: {
      example: [
        { id: 25, nom: 'Pikachu', type: ['Électrik'] },
        { id: 4, nom: 'Salamèche', type: ['Feu'] }
      ],
    },
  })
  async addFavori(@Request() req, @Param('pokemonId') pokemonId: number) {
    return this.usersService.addFavori(req.user.userId, +pokemonId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favoris/:pokemonId')
  @ApiParam({ name: 'pokemonId', required: true, example: 25, description: 'ID du Pokémon à retirer des favoris' })
  @ApiResponse({
    status: 200,
    description: 'Liste des favoris après suppression',
    schema: {
      example: [
        { id: 4, nom: 'Salamèche', type: ['Feu'] }
      ],
    },
  })
  async removeFavori(@Request() req, @Param('pokemonId') pokemonId: number) {
    return this.usersService.removeFavori(req.user.userId, +pokemonId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favoris')
  @ApiResponse({
    status: 200,
    description: 'Liste des favoris de l’utilisateur',
    schema: {
      example: [
        { id: 25, nom: 'Pikachu', type: ['Électrik'], isFavori: true },
        { id: 4, nom: 'Salamèche', type: ['Feu'], isFavori: true }
      ],
    },
  })
  async getFavoris(@Request() req) {
    const favoris = await this.usersService.getFavoris(req.user.userId);
    // Ajoute isFavori: true à chaque Pokémon
    return favoris.map(pokemon => ({ ...pokemon, isFavori: true }));
  }
}