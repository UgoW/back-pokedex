import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchTypeDto {
  @ApiProperty({ description: 'Type du Pokémon (ex: "Feu", "Eau")' })
  @IsString()
  @IsNotEmpty()
  type: string;
}