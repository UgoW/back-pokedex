import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Pokemon } from '../src/pokemon/entities/pokemon.entity';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
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

async function executeSQLFile(filePath: string) {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    await AppDataSource.query(sql);
    console.log('✅ Script SQL exécuté avec succès.');
    return true;
  } catch (err) {
    console.error('⚠️ Erreur lors de l\'exécution du fichier SQL :', err);
    return false;
  }
}

async function importPokemons() {
  if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.error('❌ Veuillez configurer les variables d\'environnement pour la base de données.');
    process.exit(1);
  }

  try {
    await AppDataSource.initialize();

    // Tentative d'exécution du script SQL
    const sqlPath = path.resolve('./pokemon.sql');
    if (fs.existsSync(sqlPath)) {
      const success = await executeSQLFile(sqlPath);
      if (success) {
        process.exit(0);
      } else {
        console.log('➡️ Passage à l\'importation JSON suite à l\'échec SQL...');
      }
    } else {
      console.log('ℹ️ Aucun fichier SQL trouvé. Importation JSON en cours...');
    }

    // Import JSON
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

    console.log('✅ Import JSON terminé avec succès.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur import :', err);
    process.exit(1);
  }
}

importPokemons();
