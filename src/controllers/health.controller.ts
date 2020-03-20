import { Controller, Get } from '@nestjs/common';
import { getConnection } from 'typeorm';

@Controller('healthz')
export class HealthController {

  @Get()
  async checkHealth() {
    let dbStatus: boolean;
    try {
      await getConnection().query('SELECT 1');
      dbStatus = true;
    } catch(err) {
      dbStatus = false;
    }

    return {
      status: 'API Online',
      dbHealth: dbStatus,
      time: Date.now()
    };
  }

}
