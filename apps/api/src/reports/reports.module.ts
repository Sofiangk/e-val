import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PeriodModule } from '../period/period.module';

@Module({
  imports: [PeriodModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
