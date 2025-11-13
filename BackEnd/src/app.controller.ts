import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  async getHealthCheck() {
    return this.appService.getHealthCheck();
  }

  @Public()
  @Get('health')
  async getHealth() {
    return this.appService.getHealthCheck();
  }
}
