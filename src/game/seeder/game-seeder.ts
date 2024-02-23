import { Injectable } from '@nestjs/common';
import { GameService } from '../game.service';
import axios from 'axios';
import { Game } from '../entities/game.entity';

type GameApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_h1: string;
  noindex: boolean;
  nofollow: boolean;
  description: string;
  nofollow_collections: string[];
};

@Injectable()
export class GameSeeder {
  private readonly gameApi: string = 'https://api.rawg.io/api';
  private readonly gameApiKey: string = '5898ef1e592e43c5bae9251fb1adc50f';
  private readonly api = axios.create({
    baseURL: this.gameApi,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  constructor(private readonly gameService: GameService) {
    this.api.interceptors.request.use((config) => {
      config.params = {
        key: this.gameApiKey,
      };
      console.log(`REQUEST TO: ${config.url}`);
      return config;
    });
  }

  public async seed() {
    const games = await this.api.get<GameApiResponse>(`games`);
    const gameData = games.data.results;
    const gamesToBeCreated = gameData.map((game) => {
      const newGame = new Game();
      newGame.id = game.id;
      newGame.name = game.name;
      newGame.slug = game.slug;
      newGame.background_image = game.background_image;
      return newGame;
    });
    const savedGames = await this.gameService.massCreate(gamesToBeCreated);
    return savedGames;
  }
}
