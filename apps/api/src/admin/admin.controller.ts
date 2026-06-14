import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin/students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get()
  list(
    @Query('page') page = '1',
    @Query('per_page') perPage = '25',
    @Query('approved') approved?: string,
  ) {
    return this.admin.listStudents({
      page: Math.max(1, Number(page) || 1),
      perPage: Math.min(100, Math.max(1, Number(perPage) || 25)),
      approved: approved === undefined ? undefined : approved === 'true',
    });
  }

  @Get('unapproved')
  unapproved() {
    return this.admin.getUnapproved();
  }

  @Post(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.admin.approve(id);
  }

  @Post('bulk-approve')
  bulkApprove(@Body() body: { ids?: unknown }) {
    const ids = Array.isArray(body?.ids) ? body.ids.map(Number).filter((n) => Number.isInteger(n)) : [];
    if (ids.length === 0) throw new BadRequestException({ message: 'ids must be a non-empty array' });
    return this.admin.bulkApprove(ids);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteStudent(id);
  }
}
