import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsernameOrEmail(username);
    if (!user) throw new UnauthorizedException();
    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
    console.log(user);
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    delete user.password;

    return {
      access_token: await this.jwtService.signAsync(payload),
      ...user,
    };
  }
}
