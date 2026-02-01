import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getStatus(): { status: string; timestamp: string; code: number } {
    return { status: 'ok', timestamp: new Date().toISOString(), code: 200 };
  }
}
