import { Controller, Get, UseGuards } from '@nestjs/common';
import { PeriodService } from './period.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('evaluation-period')
@UseGuards(JwtAuthGuard)
export class PeriodController {
  constructor(private readonly period: PeriodService) {}

  @Get('current')
  getCurrent() {
    return this.period.getCurrent();
  }
}
