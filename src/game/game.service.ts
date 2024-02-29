import { Injectable } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly userRepository: Repository<Game>,
  ) {}

  findAll(name: string) {
    return this.userRepository.find({
      where: { name: ILike(`%${name}%`) },
    });
  }

  async massCreate(games: Game[]) {
    return await this.userRepository.save(games);
  }
}
