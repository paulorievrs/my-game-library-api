import { User } from '../src/user/entities/user.entity';

export const mockUser: User = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  password: '$2b$10$4Q.6Gs9oZjCH7rvOQBNf6Oyq3Z2fLOkTCX4/bY2pDe5tXtKFJk8dG',
  bio: 'example bio',
};

export const users: User[] = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@example.com',
    bio: 'US',
    password: 'Password1!',
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@example.com',
    bio: 'UK',
    password: 'Password1!',
  },
];
