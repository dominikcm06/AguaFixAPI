import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { envs } from '../config/envs';
import { CreateReportDto } from './dtos/create-report.dto';
import { generateReportTemplate } from './templates/report.template';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateReportDto) {
    const report = await this.reportsService.create(dto);

    const notifiableEmails = await this.usersService.findNotifiableEmails();
    const recipients =
      notifiableEmails.length > 0
        ? notifiableEmails
        : [envs.MAINTENANCE_FALLBACK_EMAIL];

    const template = generateReportTemplate(dto);
    try {
      await this.emailService.sendEmail(
        recipients.join(','),
        'Nueva fuga de agua reportada',
        template,
      );
    } catch (error) {
      console.error('No se pudo enviar el correo de aviso de fuga', error);
    }

    return report;
  }
}
