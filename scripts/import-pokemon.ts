import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Pokemon } from '../src/pokemon/entities/pokemon.entity';
import * as dotenv from 'dotenv';
import * as rawData from './data/pokedex.json';

dotenv.config();

const data: any[] = Array.isArray(rawData) ? rawData : (rawData as any).default ?? [];

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Pokemon],
  synchronize: true,
});

async function importPokemons() {
  try {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Pokemon);

    for (const p of data) {
      const pokemonEntity = repo.create({
        
        nom: p.name.french,
        type: p.type,
        espece: p.species,
        description: p.description,
        evolutionNiveau: p.evolution?.next?.[0]?.[1] || null,
        taille: p.profile.height,
        poids: p.profile.weight,
        oeuf: Array.isArray(p.profile.egg) ? p.profile.egg : [p.profile.egg],
        genre: p.profile.gender,
        talentPrincipal: p.profile.ability?.find((a: any[]) => a[1] === 'false')?.[0] || '',
        talentCache: p.profile.ability?.find((a: any[]) => a[1] === 'true')?.[0] || null,
        sprite: p.image.sprite,
        miniature: p.image.thumbnail,
        hires: p.image.hires,
        hp: p.base?.HP ?? 0,
        attaque: p.base?.Attack ?? 0,
        defense: p.base?.Defense ?? 0,
        attaqueSpe: p.base?.['Sp. Attack'] ?? 0,
        defenseSpe: p.base?.['Sp. Defense'] ?? 0,
        vitesse: p.base?.Speed ?? 0,
      });

      await repo.save(pokemonEntity);
    }

    console.log('✅ Import terminé avec succès.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur import :', err);
    process.exit(1);
  }
}

importPokemons();
