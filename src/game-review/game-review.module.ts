import { Module } from '@nestjs/common';
import { GameReviewService } from './game-review.service';
import { GameReviewController } from './game-review.controller';
import { GameReview } from './entities/game-review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([GameReview]), UserModule],
  controllers: [GameReviewController],
  providers: [GameReviewService],
})
export class GameReviewModule {}
