import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { submitEvaluationSchema, type SubmitEvaluationInput } from '@e-val/shared';
import { EvaluationService } from './evaluation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('student')
export class EvaluationController {
  constructor(private readonly evaluation: EvaluationService) {}

  @Post('evaluate-course')
  @HttpCode(200)
  evaluateCourse(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(submitEvaluationSchema)) body: SubmitEvaluationInput,
  ) {
    return this.evaluation.evaluateCourse(user.userId, body);
  }
}
