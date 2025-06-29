// src/pokemons/dto/create-pokemon.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsNumber,
  IsInt,
} from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsArray()
  @IsString({ each: true })
  type: string[];

  @IsString()
  @IsNotEmpty()
  espece: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  evolutionNiveau?: string;

  @IsString()
  taille: string;

  @IsString()
  poids: string;

  @IsArray()
  @IsString({ each: true })
  oeuf: string[];

  @IsString()
  genre: string;

  @IsString()
  talentPrincipal: string;

  @IsOptional()
  @IsString()
  talentCache?: string;

  @IsString()
  sprite: string;

  @IsString()
  miniature: string;

  @IsOptional()
  @IsString()
  hires?: string;

  @IsInt()
  hp: number;

  @IsInt()
  attaque: number;

  @IsInt()
  defense: number;

  @IsInt()
  attaqueSpe: number;

  @IsInt()
  defenseSpe: number;

  @IsInt()
  vitesse: number;
}
