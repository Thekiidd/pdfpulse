import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService
  ) {}

  @Get('test')
  getTest() {
    return {
      message: 'PDFPulse NestJS API ON ✅',
      env: this.configService.get('NODE_ENV'),
    };
  }
}