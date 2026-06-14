import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { ROLES, type LoginInput, type RegisterInput } from '@e-val/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(input: RegisterInput) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { studentId: input.student_id }] },
    });
    if (existing) {
      throw new ConflictException({ message: 'Email or student ID already in use' });
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        studentId: input.student_id,
        passwordHash,
        role: ROLES.STUDENT,
        isApproved: false,
      },
    });

    return this.issueSession(user);
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }
    if (user.role === ROLES.ADMIN && !user.isApproved) {
      throw new ForbiddenException({ message: 'Admin account is not approved' });
    }
    return this.issueSession(user);
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new UnauthorizedException({ message: 'Invalid or expired refresh token' });
    }
    // Rotate: invalidate the used token before issuing a new pair.
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    return this.issueSession(stored.user);
  }

  async logout(refreshToken: string | undefined) {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    return { success: true };
  }

  private async issueSession(user: User) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_TTL') ?? '1h',
      },
    );

    const refreshToken = randomBytes(48).toString('hex');
    const ttlDays = Number(this.config.get<string>('JWT_REFRESH_TTL_DAYS') ?? '30');
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + ttlDays * 24 * 3600 * 1000),
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      role: user.role,
      user: this.toPublicUser(user),
    };
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      student_id: user.studentId,
      role: user.role,
      department_id: user.departmentId,
      semester: user.semester,
      is_approved: user.isApproved,
    };
  }
}
