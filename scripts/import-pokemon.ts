// INSERT JSON in database

// scripts/import-pokemon.ts
import { DataSource } from 'typeorm';
import { Pokemon } from '../src/pokemon/entities/pokemon.entity';
import * as data from './data/pokedex.json';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'ONV3AV320@!',
  database: 'pokedex',
  entities: [Pokemon],
  synchronize: true,
});

async function importPokemons() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Pokemon);

  for (const p of data) {
    console.log(p)
  }
  
}
importPokemons();
