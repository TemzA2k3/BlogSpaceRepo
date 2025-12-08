import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string, from?: string) {
    try {
      await this.transporter.sendMail({
        from: from || `"BlogSpace" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      return true;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
