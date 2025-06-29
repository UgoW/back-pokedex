import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserPokemonService } from './user-pokemon.service';
import { CreateUserPokemonDto } from './dto/create-user-pokemon.dto';
import { UpdateUserPokemonDto } from './dto/update-user-pokemon.dto';

@Controller('user-pokemon')
export class UserPokemonController {
  constructor(private readonly userPokemonService: UserPokemonService) {}

  @Post()
  create(@Body() createUserPokemonDto: CreateUserPokemonDto) {
    return this.userPokemonService.create(createUserPokemonDto);
  }

  @Get()
  findAll() {
    return this.userPokemonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPokemonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserPokemonDto: UpdateUserPokemonDto) {
    return this.userPokemonService.update(+id, updateUserPokemonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPokemonService.remove(+id);
  }
}
