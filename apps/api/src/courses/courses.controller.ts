import { Controller, Get, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  @Get('courses')
  listCourses() {
    return this.courses.listCourses();
  }

  @Get('departments')
  listDepartments() {
    return this.courses.listDepartments();
  }
}
