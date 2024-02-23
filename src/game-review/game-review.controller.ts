import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  HttpException,
} from '@nestjs/common';
import { GameReviewService } from './game-review.service';
import { CreateGameReviewDto } from './dto/create-game-review.dto';
import { UserService } from '../user/user.service';
import { HttpStatusCode } from 'axios';

@Controller('game-review')
export class GameReviewController {
  constructor(
    private readonly gameReviewService: GameReviewService,
    private readonly userService: UserService,
  ) {}

  @Post()
  create(@Body() createGameReviewDto: CreateGameReviewDto, @Request() request) {
    return this.gameReviewService.create(createGameReviewDto, request.user);
  }

  @Get(':id')
  async findOne(@Request() request, @Param('id') id: string) {
    const gameReview = await this.gameReviewService.findOne(+id);
    if (
      request.user.username !== gameReview.user.username &&
      !gameReview.is_public
    ) {
      return null;
    }
    return gameReview;
  }

  @Patch(':id')
  update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateGameReviewDto: CreateGameReviewDto,
  ) {
    return this.gameReviewService.update(
      updateGameReviewDto,
      +id,
      request.user,
    );
  }

  @Delete(':id')
  remove(@Request() request, @Param('id') id: string) {
    return this.gameReviewService.remove(+id, request);
  }

  @Get()
  async findUserReviews(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('username') username: string,
  ) {
    let user = request.user;
    const showPrivateReviews = request.user.username === username;
    if (!showPrivateReviews) {
      user = await this.userService.findOneByUsernameOrEmail(username);
    }
    if (!user) {
      throw new HttpException('User not found', HttpStatusCode.NotFound);
    }
    return this.gameReviewService.findUserReviews(
      user,
      page,
      limit,
      showPrivateReviews,
    );
  }
}
