import { Injectable } from '@nestjs/common';
import { CreateGameReviewDto } from './dto/create-game-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameReview } from './entities/game-review.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { paginate } from '../utils/typeorm.utils';

@Injectable()
export class GameReviewService {
  constructor(
    @InjectRepository(GameReview)
    private readonly gameReviewRepository: Repository<GameReview>,
    private readonly userService: UserService,
  ) {}

  async create(createGameReviewDto: CreateGameReviewDto, user: User) {
    const gameReview = new GameReview();
    gameReview.beat = createGameReviewDto.beat;
    gameReview.game = createGameReviewDto.game;
    gameReview.gave_up = createGameReviewDto.gave_up;
    gameReview.played_for = createGameReviewDto.played_for;
    gameReview.review = createGameReviewDto.review;
    gameReview.is_public = createGameReviewDto.is_public;
    gameReview.rating = createGameReviewDto.rating;
    gameReview.review_at = new Date();
    gameReview.user = await this.userService.findOne(user.id);
    await this.gameReviewRepository.insert(gameReview);
    return gameReview;
  }

  async update(
    createGameReviewDto: CreateGameReviewDto,
    id: string,
    user: User,
  ) {
    const gameReview = await this.findOne(id);
    if (gameReview.user.username !== user.username) {
      return null;
    }

    gameReview.beat = createGameReviewDto.beat;
    gameReview.game = createGameReviewDto.game;
    gameReview.gave_up = createGameReviewDto.gave_up;
    gameReview.played_for = createGameReviewDto.played_for;
    gameReview.review = createGameReviewDto.review;
    gameReview.is_public = createGameReviewDto.is_public;
    gameReview.rating = createGameReviewDto.rating;
    gameReview.game = createGameReviewDto.game;
    return this.gameReviewRepository.save(gameReview);
  }

  findOne(id: string) {
    return this.gameReviewRepository.findOne({
      where: { id },
      relations: ['game', 'user'],
    });
  }

  async remove(id: string, user: User) {
    const gameReview = await this.findOne(id);
    if (gameReview.user.username !== user.username) {
      return null;
    }
    return this.gameReviewRepository.delete({ id });
  }

  async findUserReviews(
    user: User,
    page: number,
    limit: number,
    showPrivateReviews: boolean,
  ) {
    const { id } = user;
    const options: FindManyOptions<GameReview> = {
      where: {
        user: { id },
        ...(showPrivateReviews ? {} : { is_public: true }),
      },
      relations: ['game', 'user'],
    };

    return paginate(this.gameReviewRepository, page, limit, options);
  }
}
