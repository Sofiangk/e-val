import { Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import type { ReportRow, ReportSummary } from '@e-val/shared';
import { PrismaService } from '../prisma/prisma.service';
import { PeriodService } from '../period/period.service';

const round1 = (n: number) => Math.round(n * 10) / 10;

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly period: PeriodService,
  ) {}

  async summary(departmentId?: number): Promise<ReportSummary> {
    const courseWhere = departmentId ? { departmentId } : {};

    const [courses, evaluatedGroups, avgGroups, period] = await Promise.all([
      this.prisma.course.findMany({
        where: courseWhere,
        include: { department: true, _count: { select: { enrollments: true } } },
        orderBy: { courseCode: 'asc' },
      }),
      this.prisma.enrollment.groupBy({
        by: ['courseId'],
        where: { isEvaluated: true, course: courseWhere },
        _count: true,
      }),
      this.prisma.evaluation.groupBy({
        by: ['courseId'],
        where: { course: courseWhere },
        _avg: { selectedValue: true },
      }),
      this.period.getActivePeriod(),
    ]);

    const evaluatedByCourse = new Map(evaluatedGroups.map((g) => [g.courseId, g._count]));
    const avgByCourse = new Map(avgGroups.map((g) => [g.courseId, g._avg.selectedValue]));

    const rows: ReportRow[] = courses.map((c) => {
      const enrolled = c._count.enrollments;
      const evaluated = evaluatedByCourse.get(c.id) ?? 0;
      const avg = avgByCourse.get(c.id);
      return {
        course_id: c.id,
        name: c.name,
        course_code: c.courseCode,
        department_id: c.departmentId,
        department_name: c.department.name,
        enrolled_count: enrolled,
        evaluated_count: evaluated,
        avg_score: avg === null || avg === undefined ? null : round1(avg),
      };
    });

    const enrolledTotal = rows.reduce((s, r) => s + r.enrolled_count, 0);
    const evaluatedTotal = rows.reduce((s, r) => s + r.evaluated_count, 0);
    const scored = rows.filter((r) => r.avg_score !== null);
    const overallAvg = scored.length
      ? round1(scored.reduce((s, r) => s + (r.avg_score as number), 0) / scored.length)
      : null;

    return {
      term: period
        ? {
            id: period.id,
            name: period.name,
            starts_at: period.startsAt.toISOString(),
            ends_at: period.endsAt.toISOString(),
          }
        : null,
      rows,
      totals: {
        courses: rows.length,
        enrolled: enrolledTotal,
        evaluated: evaluatedTotal,
        overall_completion_pct: enrolledTotal ? round1((evaluatedTotal / enrolledTotal) * 100) : 0,
        overall_avg_score: overallAvg,
      },
    };
  }

  async courseAverages(courseId: number) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException({ message: 'Course not found.' });

    const groups = await this.prisma.evaluation.groupBy({
      by: ['questionId'],
      where: { courseId },
      _avg: { selectedValue: true },
      _count: true,
    });
    const questionIds = groups.map((g) => g.questionId);
    const questions = await this.prisma.question.findMany({ where: { id: { in: questionIds } } });
    const textById = new Map(questions.map((q) => [q.id, q.text]));

    return {
      course: { id: course.id, name: course.name, course_code: course.courseCode },
      total_responses: groups.reduce((s, g) => s + g._count, 0),
      averages: groups.map((g) => ({
        question_id: g.questionId,
        question_text: textById.get(g.questionId) ?? null,
        average: g._avg.selectedValue === null ? null : round1(g._avg.selectedValue),
        responses: g._count,
      })),
    };
  }

  async exportBuffer(
    format: 'csv' | 'xlsx',
    departmentId?: number,
  ): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
    const summary = await this.summary(departmentId);
    const termName = summary.term?.name ?? 'all-terms';
    const base = `e-val-report-${termName.replace(/\s+/g, '-').toLowerCase()}`;

    const header = [
      'Course',
      'Code',
      'Department',
      'Enrolled',
      'Evaluated',
      'Completion %',
      'Avg Score',
    ];
    const toRow = (r: ReportRow) => [
      r.name,
      r.course_code,
      r.department_name,
      r.enrolled_count,
      r.evaluated_count,
      r.enrolled_count ? round1((r.evaluated_count / r.enrolled_count) * 100) : 0,
      r.avg_score ?? '',
    ];

    if (format === 'xlsx') {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('Report');
      ws.addRow([`Evaluation report — ${termName}`]);
      ws.addRow(header);
      summary.rows.forEach((r) => ws.addRow(toRow(r)));
      const buffer = Buffer.from(await wb.xlsx.writeBuffer());
      return {
        buffer,
        filename: `${base}.xlsx`,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };
    }

    const escape = (v: string | number) => {
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      `# Evaluation report — ${termName}`,
      header.join(','),
      ...summary.rows.map((r) => toRow(r).map(escape).join(',')),
    ];
    return {
      buffer: Buffer.from(lines.join('\n'), 'utf-8'),
      filename: `${base}.csv`,
      contentType: 'text/csv',
    };
  }
}
