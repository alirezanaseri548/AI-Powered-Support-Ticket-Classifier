import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'AI-Powered Support Ticket Classifier API',
      status: 'running',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'backend-api',
      timestamp: new Date().toISOString(),
    };
  }
}
