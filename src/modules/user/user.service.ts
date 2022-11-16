import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(user: CreateUserDto) {
    return this.userRepository.createUser(user);
  }

  async findOne(userId: number) {
    return this.userRepository.findOne(userId);
  }
}
