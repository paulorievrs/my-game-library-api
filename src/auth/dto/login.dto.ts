import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username/e-mail must have atleast 3 characters.' })
  usernameOrEmail: string;

  @IsNotEmpty()
  password: string;
}
