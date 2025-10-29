// src/stats/stats.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('count')
  async getCount() {
    return this.statsService.getCount();
  }

  @Post('count/increment')
  async increment(@Body() body: { type?: string; hash?: string }) {
    return this.statsService.increment(body.type || 'pdf', body.hash || null);
  }
}