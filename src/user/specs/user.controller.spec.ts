import { mockUser } from './../../../test/mocks';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createdUser: User = {
        id: 1,
        ...mockUser,
      };

      jest.spyOn(userService, 'create').mockResolvedValue(createdUser);

      const result = await controller.create(mockUser);

      expect(result).toBeDefined();
      expect(result).toEqual(createdUser);
    });
  });

  describe('update', () => {
    it('should update the user with the specified id', async () => {
      const userId = '123';
      const updateUserDto: UpdateUserDto = {
        username: 'updatedUser',
        email: 'updated@example.com',
        password: 'UpdatedPassword1!',
        bio: 'UK',
      };

      const updatedUser: User = {
        id: userId,
        ...updateUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update(userId.toString(), updateUserDto, {
        user: updatedUser,
      });

      expect(result).toBeDefined();
      expect(result).toEqual(updatedUser);
    });
  });
});
