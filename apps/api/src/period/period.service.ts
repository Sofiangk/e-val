import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { EvaluationPeriod as EvaluationPeriodDto } from '@e-val/shared';

@Injectable()
export class PeriodService {
  constructor(private readonly prisma: PrismaService) {}

  /** The period whose window contains now, else the most recent one. */
  async getActivePeriod() {
    const now = new Date();
    const open = await this.prisma.evaluationPeriod.findFirst({
      where: { startsAt: { lte: now }, endsAt: { gte: now } },
      orderBy: { endsAt: 'desc' },
    });
    if (open) return open;
    return this.prisma.evaluationPeriod.findFirst({ orderBy: { endsAt: 'desc' } });
  }

  async getCurrent(): Promise<EvaluationPeriodDto | null> {
    const period = await this.getActivePeriod();
    if (!period) return null;
    const now = new Date();
    return {
      id: period.id,
      name: period.name,
      starts_at: period.startsAt.toISOString(),
      ends_at: period.endsAt.toISOString(),
      is_open: period.startsAt <= now && period.endsAt >= now,
      message: period.message,
    };
  }

  async assertOpen() {
    const current = await this.getCurrent();
    if (!current || !current.is_open) {
      throw new ForbiddenException({ message: 'The evaluation period is closed' });
    }
  }
}
