import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access token when username and password are correct', async () => {
      const signInDto: LoginDto = {
        usernameOrEmail: 'testuser',
        password: 'password',
      };
      const accessToken = 'mockAccessToken';

      jest
        .spyOn(authService, 'signIn')
        .mockResolvedValue({ access_token: accessToken });

      const result = await controller.signIn(signInDto);

      expect(result).toEqual({ access_token: accessToken });
    });

    it('should throw UnauthorizedException when username or password is incorrect', async () => {
      const signInDto: LoginDto = {
        usernameOrEmail: 'testuser',
        password: 'incorrectpassword',
      };

      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new UnauthorizedException());

      await expect(controller.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
