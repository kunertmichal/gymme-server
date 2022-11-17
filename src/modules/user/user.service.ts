import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(user: CreateUserDto) {
    return this.userRepository.createUser(user);
  }

  async findOne(data: Prisma.UserWhereUniqueInput) {
    return this.userRepository.findOne(data);
  }

  async findMe(id: number) {
    return await this.userRepository.findOneWithoutSensitiveData(id);
  }

  async update(id: number, data: UpdateUserDto) {
    return await this.userRepository.updateById({
      where: { id },
      data,
    });
  }
}
