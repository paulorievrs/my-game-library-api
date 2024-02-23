import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { GameSeeder } from './seeder/game-seeder';
import { HttpStatusCode } from 'axios';
import { GameService } from './game.service';
import { ConfigService } from '@nestjs/config';

@Controller('/game')
export class GameController {
  constructor(
    private readonly gameSeeder: GameSeeder,
    private readonly gameService: GameService,
    private configService: ConfigService,
  ) {}

  @Get('seed')
  seed(@Query('seedPassword') seedPassword: string) {
    if (seedPassword !== this.configService.get<string>('SEED_PASSWORD')) {
      throw new HttpException(
        'Invalid seed password',
        HttpStatusCode.Unauthorized,
      );
    }
    this.gameSeeder.seed();
  }

  @Get('/')
  getAll() {
    return this.gameService.findAll();
  }
}
