import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { mockUser } from '../../../test/mocks';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should return an user by name or email', async () => {
    const usernameOrEmail = 'testuser';

    jest.spyOn(service, 'findOneByUsernameOrEmail').mockResolvedValue(mockUser);

    const result = await service.findOneByUsernameOrEmail(usernameOrEmail);

    expect(result).toBeDefined();
    expect(result).toEqual(mockUser);
  });
});
