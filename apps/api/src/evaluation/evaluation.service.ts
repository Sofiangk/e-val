import { ForbiddenException, Injectable } from '@nestjs/common';
import type { SubmitEvaluationInput } from '@e-val/shared';
import { PrismaService } from '../prisma/prisma.service';
import { PeriodService } from '../period/period.service';

@Injectable()
export class EvaluationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly period: PeriodService,
  ) {}

  async evaluateCourse(userId: number, input: SubmitEvaluationInput) {
    await this.period.assertOpen();

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: input.course_id } },
    });
    if (!enrollment) {
      throw new ForbiddenException({ message: 'You are not enrolled in this course' });
    }

    // Replace any prior answers for this course atomically, then mark complete.
    await this.prisma.$transaction([
      this.prisma.evaluation.deleteMany({ where: { userId, courseId: input.course_id } }),
      this.prisma.evaluation.createMany({
        data: input.responses.map((r) => ({
          userId,
          courseId: input.course_id,
          questionId: r.question_id,
          selectedValue: r.selected_value,
        })),
      }),
      this.prisma.enrollment.update({
        where: { userId_courseId: { userId, courseId: input.course_id } },
        data: { isEvaluated: true },
      }),
    ]);

    const remaining = await this.prisma.enrollment.findMany({
      where: { userId, isEvaluated: false },
      include: { course: true },
    });

    return {
      message: 'Course evaluated successfully.',
      not_evaluated_courses: remaining.map((e) => ({
        id: e.course.id,
        name: e.course.name,
        course_code: e.course.courseCode,
      })),
      all_evaluated: remaining.length === 0,
    };
  }
}
