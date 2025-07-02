// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async addFavori(userId: number, pokemonId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoris'],
    });
    const pokemon = await this.pokemonRepository.findOne({
      where: { id: pokemonId },
    });
    if (!user || !pokemon)
      throw new NotFoundException('User or Pokémon not found');
    if (!user.favoris.some((p) => p.id === pokemon.id)) {
      user.favoris.push(pokemon);
      await this.userRepository.save(user);
    }
    return user.favoris;
  }

  async removeFavori(userId: number, pokemonId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoris'],
    });
    if (!user) throw new NotFoundException('User not found');
    user.favoris = user.favoris.filter((p) => p.id !== pokemonId);
    await this.userRepository.save(user);
    return user.favoris;
  }

  async getFavoris(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoris'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user.favoris;
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['favoris'],
    });
  }

  async isFavori(userId: number, id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoris'],
    });
    let isFavori = false;
    if (user && user.favoris?.some((p) => Number(p.id) === Number(id))) {
      isFavori = true;
    }
    console.log(
      'Favoris:',
      user?.favoris?.map((p) => p.id),
      'Cherché:',
      id,
    );
    return isFavori;
  }
}
