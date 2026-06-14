import { Injectable, NotFoundException } from '@nestjs/common';
import { ROLES } from '@e-val/shared';
import { PrismaService } from '../prisma/prisma.service';

interface ListParams {
  page: number;
  perPage: number;
  approved?: boolean;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listStudents({ page, perPage, approved }: ListParams) {
    const where = {
      role: ROLES.STUDENT,
      ...(approved === undefined ? {} : { isApproved: approved }),
    };
    const [rows, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: { department: true, _count: { select: { enrollments: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: rows.map((u) => this.toStudentRow(u)),
      meta: { page, per_page: perPage, total },
    };
  }

  async getUnapproved() {
    const rows = await this.prisma.user.findMany({
      where: { role: ROLES.STUDENT, isApproved: false },
      include: { department: true, _count: { select: { enrollments: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((u) => this.toStudentRow(u));
  }

  async approve(id: number) {
    await this.ensureStudent(id);
    await this.prisma.user.update({ where: { id }, data: { isApproved: true } });
    return { message: 'Student approved successfully.' };
  }

  async bulkApprove(ids: number[]) {
    const result = await this.prisma.user.updateMany({
      where: { id: { in: ids }, role: ROLES.STUDENT },
      data: { isApproved: true },
    });
    return { message: 'Students approved.', approved: result.count };
  }

  async deleteStudent(id: number) {
    await this.ensureStudent(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Student deleted successfully.' };
  }

  private async ensureStudent(id: number) {
    const student = await this.prisma.user.findFirst({ where: { id, role: ROLES.STUDENT } });
    if (!student) throw new NotFoundException({ message: 'Student not found.' });
  }

  private toStudentRow(u: {
    id: number;
    name: string | null;
    email: string;
    studentId: string | null;
    semester: number | null;
    isApproved: boolean;
    department: { name: string } | null;
    _count: { enrollments: number };
  }) {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      student_id: u.studentId,
      semester: u.semester,
      is_approved: u.isApproved,
      department_name: u.department?.name ?? null,
      registered_courses_count: u._count.enrollments,
    };
  }
}
