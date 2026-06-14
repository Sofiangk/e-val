import { Controller, Get, Param, ParseIntPipe, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

const parseDept = (v?: string) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isInteger(n) ? n : undefined;
};

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('reports/summary')
  summary(@Query('department_id') departmentId?: string) {
    return this.reports.summary(parseDept(departmentId));
  }

  @Get('course-averages/:courseId')
  courseAverages(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.reports.courseAverages(courseId);
  }

  @Get('reports/export')
  async export(
    @Res() res: Response,
    @Query('format') format = 'csv',
    @Query('department_id') departmentId?: string,
  ) {
    const fmt = format === 'xlsx' ? 'xlsx' : 'csv';
    const { buffer, filename, contentType } = await this.reports.exportBuffer(
      fmt,
      parseDept(departmentId),
    );
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  }
}
