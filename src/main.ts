import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, LogLevel, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.fiter';

const LOG_LEVELS: LogLevel[] = (process.env.LOG_LEVELS?.split(
  ',',
) as LogLevel[]) ?? ['error', 'warn'];

async function bootstrap() {
  const ALLOWED_ORIGINS =
    process.env.NODE_ENV !== 'production'
      ? (process.env.ALLOWED_ORIGINS_DEV?.split(',') ?? [
          'http://localhost:3001',
        ])
      : (process.env.ALLOWED_ORIGINS?.split(',') ?? ['https://localhost:3001']);

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      timestamp: true,
      json: true,
      prefix: '[ChoganAPI]',
      logLevels: LOG_LEVELS,
    }),
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: ALLOWED_ORIGINS,
    methods: 'POST,GET,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
