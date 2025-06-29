import { PartialType } from '@nestjs/swagger';
import { CreateUserPokemonDto } from './create-user-pokemon.dto';

export class UpdateUserPokemonDto extends PartialType(CreateUserPokemonDto) {}
