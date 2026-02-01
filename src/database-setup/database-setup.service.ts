import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prismaservice/prisma.service';
import { Role } from 'src/generated/prisma/enums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseSetupService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSetupService.name);

  constructor(
    private readonly db: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    // Warte kurz, damit PrismaService vollständig initialisiert ist
    setTimeout(() => {
      void this.ensureAdminUserExists();
    }, 1000);
  }

  private async ensureAdminUserExists() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        'ADMIN_EMAIL or ADMIN_PASSWORD not defined in .env. Skipping admin user creation.',
      );
      return;
    }

    try {
      const existingAdmin = await this.db.user.findFirst({
        where: { role: Role.ADMIN },
      });

      if (existingAdmin) {
        this.logger.log('Admin user already exists.');
        return;
      }

      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = await this.db.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: Role.ADMIN,
        },
      });

      this.logger.log(
        `Admin user successfully created: ${admin.email} (ID: ${admin.id})`,
      );
    } catch (error) {
      this.logger.error(
        'Error creating admin user:',
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
