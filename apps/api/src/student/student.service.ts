import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: true,
        enrollments: { include: { course: true }, orderBy: { courseId: 'asc' } },
      },
    });
    if (!user) throw new NotFoundException({ message: 'Student not found' });

    const registered_courses = user.enrollments.map((e) => ({
      id: e.course.id,
      name: e.course.name,
      course_code: e.course.courseCode,
      instructor: e.course.instructor,
      is_evaluated: e.isEvaluated,
    }));
    const evaluated_courses = registered_courses.filter((c) => c.is_evaluated);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      student_id: user.studentId,
      role: user.role,
      department_id: user.departmentId,
      department_name: user.department?.name ?? null,
      semester: user.semester,
      is_approved: user.isApproved,
      is_evaluated:
        registered_courses.length > 0 && evaluated_courses.length === registered_courses.length,
      registered_courses,
      evaluated_courses,
      total_courses: registered_courses.length,
      total_evaluated_courses: evaluated_courses.length,
    };
  }

  async getQuestionSections() {
    const sections = await this.prisma.questionSection.findMany({
      orderBy: { position: 'asc' },
      include: { questions: { orderBy: { id: 'asc' } } },
    });
    return sections.map((s) => ({
      id: s.id,
      title: s.title,
      position: s.position,
      questions: s.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: JSON.parse(q.options) as Array<{ text: string; value: number }>,
      })),
    }));
  }
}
