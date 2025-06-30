 
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty({ description: 'Nom partiel ou complet du Pokémon (sensible à la casse)' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
