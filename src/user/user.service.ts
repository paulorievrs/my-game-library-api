import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SALTING_ROUNDS } from '../config/password';

@Injectable()
export class UserService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.bio = createUserDto.bio;

    const hash = await bcrypt.hash(createUserDto.password, SALTING_ROUNDS);
    user.password = hash;

    const userEmailExist = await this.findOneByUsernameOrEmail(user.email);
    if (userEmailExist) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }

    const userNameExist = await this.findOneByUsernameOrEmail(user.username);
    if (userNameExist) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }

    return this.userRepository.save(user);
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  findOne(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.email = updateUserDto.email;
    user.username = updateUserDto.username;
    user.bio = updateUserDto.bio;
    user.id = id;

    const hash = await bcrypt.hash(updateUserDto.password, SALTING_ROUNDS);
    user.password = hash;

    return this.userRepository.save(user);
  }

  /**
   * this function used to get data of use whose email/username is passed in parameter
   * @param usernameOrEmail is type of string, which represent the username or the email of the user.
   * @returns promise of user
   */
  findOneByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      select: ['id', 'username', 'email', 'bio', 'password'],
    });
  }
}
