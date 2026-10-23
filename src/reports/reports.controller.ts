import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
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
    private readonly storageService: StorageService,
  ) {}

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() dto: CreateReportDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    if (!photo) {
      throw new BadRequestException('La foto de la fuga es obligatoria');
    }
    if (!photo.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo photo debe ser una imagen');
    }

    const photoUrl = await this.storageService.uploadFile(photo, 'reports');
    const report = await this.reportsService.create(dto, photoUrl);

    const notifiableEmails = await this.usersService.findNotifiableEmails();
    const recipients =
      notifiableEmails.length > 0
        ? notifiableEmails
        : [envs.MAINTENANCE_FALLBACK_EMAIL];

    const template = generateReportTemplate(dto, photoUrl);
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
