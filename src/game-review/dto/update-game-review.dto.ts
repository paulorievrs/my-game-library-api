import { PartialType } from '@nestjs/mapped-types';
import { CreateGameReviewDto } from './create-game-review.dto';

export class UpdateGameReviewDto extends PartialType(CreateGameReviewDto) {}
