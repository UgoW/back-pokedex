import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

// Create ENTITY TABLE WITH COLUMN ( SCHEMA)
@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column('simple-array')
  type: string[];

  @Column()
  espece: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  evolutionNiveau: string;

  @Column()
  taille: string;

  @Column()
  poids: string;

  @Column('simple-array')
  oeuf: string[];

  @Column()
  genre: string;

  @Column()
  talentPrincipal: string;

  @Column({ nullable: true })
  talentCache: string;

  @Column()
  sprite: string;

  @Column()
  miniature: string;

  @Column({ nullable: true })
  hires: string;

  @Column()
  hp: number;

  @Column()
  attaque: number;

  @Column()
  defense: number;

  @Column()
  attaqueSpe: number;

  @Column()
  defenseSpe: number;

  @Column()
  vitesse: number;
}
