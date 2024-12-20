import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponse, UserFull } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private formatUser(user: UserFull): UserResponse {
    return {
      id: user.id,
      login: user.login,
      version: Number(user.version),
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.formatUser(user as UserFull));
  }

  async findOne(id: string): Promise<UserFull> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user as UserFull;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
      },
    });

    return this.formatUser(user as UserFull);
  }

  async update(
    id: string,
    updateUserDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const user = await this.findOne(id);

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updateUserDto.newPassword,
        version: {
          increment: 1,
        },
      },
    });

    return this.formatUser(updatedUser as UserFull);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }
}
