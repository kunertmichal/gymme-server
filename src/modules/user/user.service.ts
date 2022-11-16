import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(user: CreateUserDto) {
    return this.userRepository.createUser(user);
  }

  async findOne(userId: number) {
    return this.userRepository.findOne(userId);
  }

  async update(user: UpdateUserDto) {
    return this.userRepository.updateById({
      where: { id: user.id },
      data: user,
    });
  }
}
