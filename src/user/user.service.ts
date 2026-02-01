import { Injectable } from '@nestjs/common';
import { UserCreateInput, UserUpdateInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}

  async create(createUserDto: UserCreateInput) {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };
    return await this.db.user.create({ data: userData });
  }

  async findAll() {
    return await this.db.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, updateUserDto: UserUpdateInput) {
    // If password is being updated, hash it
    let userData = { ...updateUserDto };
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(
        updateUserDto.password as string,
        10,
      );
      userData = {
        ...updateUserDto,
        password: hashedPassword,
      };
    }

    return await this.db.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    return await this.db.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }
}
