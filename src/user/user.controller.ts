import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/public.decorator';
import { HttpStatusCode } from 'axios';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/me')
  me(@Request() request) {
    return this.userService.findOne(request.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() request,
  ) {
    if (request.user.id !== id) {
      throw new HttpException('Unauthorized', HttpStatusCode.Unauthorized);
    }
    return this.userService.update(id, updateUserDto);
  }
}
