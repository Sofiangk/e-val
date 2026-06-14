import { Controller, Get, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private readonly student: StudentService) {}

  @Get('student')
  @UseGuards(RolesGuard)
  @Roles('student')
  getProfile(@CurrentUser() user: AuthUser) {
    return this.student.getProfile(user.userId);
  }

  @Get('question-sections')
  getQuestionSections() {
    return this.student.getQuestionSections();
  }
}
