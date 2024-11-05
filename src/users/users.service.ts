import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User, UserResponse } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll(): UserResponse[] {
    return this.users.map((user) => user.toResponse());
  }

  findOne(id: string): UserResponse {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user.toResponse();
  }

  create(createUserDto: CreateUserDto): UserResponse {
    const newUser = new User({
      ...createUserDto,
      id: uuidv4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    if (!newUser.validate()) {
      throw new BadRequestException('Invalid user data');
    }

    this.users.push(newUser);
    return newUser.toResponse();
  }

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): UserResponse {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (!user.checkPassword(updatePasswordDto.oldPassword)) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.updatePassword(updatePasswordDto.newPassword);
    return user.toResponse();
  }

  remove(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(index, 1);
  }
}
