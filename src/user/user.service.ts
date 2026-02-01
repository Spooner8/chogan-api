import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { UserCreateInput, UserUpdateInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prismaservice/prisma.service';
import { Role } from 'src/generated/prisma/enums';
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

  async update(
    id: string,
    updateUserDto: UserUpdateInput,
    currentUserId: string,
  ) {
    // Prevent user from changing their own role
    if (id === currentUserId && updateUserDto.role !== undefined) {
      throw new ForbiddenException(
        'Sie können Ihre eigene Rolle nicht ändern. Bitten Sie einen anderen Administrator, dies zu tun.',
      );
    }

    // If role is being changed from ADMIN to USER, check if this is the last admin
    if (updateUserDto.role === Role.USER) {
      const targetUser = await this.db.user.findUnique({
        where: { id },
        select: { role: true },
      });

      if (targetUser?.role === Role.ADMIN) {
        const adminCount = await this.db.user.count({
          where: { role: Role.ADMIN },
        });

        if (adminCount <= 1) {
          throw new BadRequestException(
            'Der letzte Administrator kann nicht zum normalen Benutzer degradiert werden. Erstellen Sie zuerst einen weiteren Administrator.',
          );
        }
      }
    }

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

  async remove(id: string, currentUserId: string) {
    // Prevent user from deleting themselves
    if (id === currentUserId) {
      throw new ForbiddenException('Sie können sich nicht selbst löschen.');
    }

    // Check if this is the last admin
    const targetUser = await this.db.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (targetUser?.role === Role.ADMIN) {
      const adminCount = await this.db.user.count({
        where: { role: Role.ADMIN },
      });

      if (adminCount <= 1) {
        throw new BadRequestException(
          'Der letzte Administrator kann nicht gelöscht werden. Erstellen Sie zuerst einen weiteren Administrator.',
        );
      }
    }

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
