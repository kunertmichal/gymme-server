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

  async findOne(email: string) {
    return this.userRepository.findOne(email);
  }

  async update(id: number, data: UpdateUserDto) {
    return await this.userRepository.updateById({
      where: { id },
      data,
    });
  }
}
