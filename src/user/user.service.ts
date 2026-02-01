import { Injectable } from '@nestjs/common';
import { UserCreateInput, UserUpdateInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}

  async create(createUserDto: UserCreateInput) {
    return await this.db.user.create({ data: createUserDto });
  }

  async findAll() {
    return await this.db.user.findMany();
  }

  async findOne(id: string) {
    return await this.db.user.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UserUpdateInput) {
    return await this.db.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return await this.db.user.delete({ where: { id } });
  }
}
