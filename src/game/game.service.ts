import { Injectable } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly userRepository: Repository<Game>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  async massCreate(games: Game[]) {
    return await this.userRepository.save(games);
  }
}
