import { defineConfig } from 'prisma/config';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the environment variables.');
}

export default defineConfig({
  datasource: {
    url: DATABASE_URL,
  },
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
});
