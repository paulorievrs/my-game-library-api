import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  Max,
  Min,
} from 'class-validator';
import { Game } from '../../game/entities/game.entity';

export class CreateGameReviewDto {
  @IsNotEmpty({ message: 'Review is required.' })
  review: string;

  @IsBoolean({
    message: 'Beat has to be a boolean',
  })
  beat?: boolean;

  @IsBoolean({
    message: 'Gave up has to be a boolean',
  })
  gave_up?: boolean;

  @IsInt()
  played_for: number;

  @IsInt()
  @Max(5)
  @Min(1)
  rating: number;

  @IsBoolean()
  is_public: boolean;

  @IsNotEmptyObject()
  @Type(() => Game)
  game: Game;
}
