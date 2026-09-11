import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: envs.MAILER_SERVICE,
      auth: {
        user: envs.MAILER_USER,
        pass: envs.MAILER_PASS,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: envs.MAILER_USER,
      to,
      subject,
      html: template,
    });
  }
}
