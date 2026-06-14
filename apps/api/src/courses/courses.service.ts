import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async listCourses() {
    const [courses, evaluatedGroups] = await Promise.all([
      this.prisma.course.findMany({
        include: {
          department: true,
          _count: { select: { enrollments: true } },
        },
        orderBy: { courseCode: 'asc' },
      }),
      this.prisma.enrollment.groupBy({
        by: ['courseId'],
        where: { isEvaluated: true },
        _count: true,
      }),
    ]);
    const evaluatedByCourse = new Map(evaluatedGroups.map((g) => [g.courseId, g._count]));
    return courses.map((c) => ({
      id: c.id,
      name: c.name,
      course_code: c.courseCode,
      instructor: c.instructor,
      course_credits: c.courseCredits,
      department_id: c.departmentId,
      department_name: c.department.name,
      enrolled_students: c._count.enrollments,
      evaluated_students: evaluatedByCourse.get(c.id) ?? 0,
    }));
  }

  listDepartments() {
    return this.prisma.department.findMany({ orderBy: { name: 'asc' } });
  }
}
