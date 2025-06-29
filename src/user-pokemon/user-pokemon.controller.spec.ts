import { Test, TestingModule } from '@nestjs/testing';
import { UserPokemonController } from './user-pokemon.controller';
import { UserPokemonService } from './user-pokemon.service';

describe('UserPokemonController', () => {
  let controller: UserPokemonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPokemonController],
      providers: [UserPokemonService],
    }).compile();

    controller = module.get<UserPokemonController>(UserPokemonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
