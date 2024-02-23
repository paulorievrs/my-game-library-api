import { Test, TestingModule } from '@nestjs/testing';
import { GameReviewController } from '../game-review.controller';
import { GameReviewService } from '../game-review.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { GameReview } from '../entities/game-review.entity';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';
import { CreateGameReviewDto } from '../dto/create-game-review.dto';

describe('GameReviewController', () => {
  let controller: GameReviewController;
  let service: GameReviewService;
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameReviewController],
      providers: [
        GameReviewService,
        UserService,
        {
          provide: getRepositoryToken(GameReview),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<GameReviewController>(GameReviewController);
    service = module.get<GameReviewService>(GameReviewService);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new game review', async () => {
      const createGameReviewDto: CreateGameReviewDto = {
        review: 'Great game!',
        beat: false,
        gave_up: false,
        played_for: 10,
        rating: 4,
        is_public: true,
        game: { id: 1, slug: 'test', name: 'Test', background_image: '' },
      };

      const request = { user: { username: 'testuser' } };

      const user = new User();
      user.id = 1;
      user.username = 'testuser';

      const gameReview = new GameReview();
      gameReview.id = 1;
      gameReview.user = user;
      gameReview.review = 'Great game!';
      gameReview.beat = false;
      gameReview.gave_up = false;
      gameReview.played_for = 10;
      gameReview.rating = 4;
      gameReview.is_public = true;
      gameReview.game = {
        id: 1,
        slug: 'test',
        name: 'Test',
        background_image: '',
      };

      jest.spyOn(service, 'create').mockResolvedValue({
        identifiers: [{ id: gameReview.id }],
        generatedMaps: [
          {
            id: gameReview.id,
            beat: gameReview.beat,
            gave_up: gameReview.gave_up,
            is_public: gameReview.is_public,
          },
        ],
        raw: [
          {
            id: gameReview.id,
            beat: gameReview.beat,
            gave_up: gameReview.gave_up,
            is_public: gameReview.is_public,
          },
        ],
      });

      const result = await controller.create(createGameReviewDto, request);

      expect(result).toHaveProperty('identifiers', [{ id: gameReview.id }]);
    });
  });

  describe('findOne', () => {
    it('should return a game review by id if user matches', async () => {
      const id = '1';
      const request = { user: { username: 'testuser' } };

      const user = new User();
      user.id = 1;
      user.username = 'testuser';

      const gameReview2 = new GameReview();
      gameReview2.id = 1;
      gameReview2.user = user;
      gameReview2.review = 'Great game!';
      gameReview2.beat = false;
      gameReview2.gave_up = false;
      gameReview2.played_for = 10;
      gameReview2.rating = 4;
      gameReview2.is_public = true;
      gameReview2.game = {
        id: 1,
        slug: 'test',
        name: 'Test',
        background_image: '',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(gameReview2);

      const result = await controller.findOne(request, id);

      expect(result).toHaveProperty('id', gameReview2.id);
    });

    it('should return null if user does not match and its not public', async () => {
      const id = '1';
      const request = { user: { username: 'otheruser' } };

      const user = new User();
      user.id = 1;
      user.username = 'testuser';

      const gameReview = {
        id: 1,
        user,
        review: 'Great game!',
        beat: false,
        gave_up: false,
        played_for: 10,
        rating: 4,
        is_public: false,
        game: { id: 1, slug: 'test', name: 'Test', background_image: '' },
        review_at: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(gameReview);

      const result = await controller.findOne(request, id);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing game review', async () => {
      const id = '1';
      const updateGameReviewDto: CreateGameReviewDto = {
        review: 'Awesome game!',
        beat: true,
        gave_up: false,
        played_for: 15,
        rating: 5,
        is_public: true,
        game: { id: 1, slug: 'test', name: 'Test', background_image: '' },
      };

      const user = new User();
      user.id = 1;
      user.username = 'testuser';

      const gameReview = new GameReview();
      gameReview.id = 1;
      gameReview.user = user;
      gameReview.review = 'Great game!';
      gameReview.beat = false;
      gameReview.gave_up = false;
      gameReview.played_for = 10;
      gameReview.rating = 4;
      gameReview.is_public = true;
      gameReview.game = {
        id: 1,
        slug: 'test',
        name: 'Test',
        background_image: '',
      };

      const request = { user: { username: 'testuser' } };

      jest.spyOn(service, 'update').mockResolvedValue(gameReview);

      const result = await controller.update(request, id, updateGameReviewDto);

      expect(result).toHaveProperty('id', gameReview.id);
    });
  });

  describe('remove', () => {
    it('should remove a game review by id', async () => {
      const id = '1';
      const request = { user: { username: 'testuser' } };

      jest.spyOn(service, 'remove').mockResolvedValue({} as DeleteResult);

      const result = await controller.remove(request, id);

      expect(result).toEqual({});
    });
  });
});
