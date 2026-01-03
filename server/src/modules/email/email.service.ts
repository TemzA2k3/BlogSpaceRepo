import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
        });
    }

    async sendMail(to: string, subject: string, html: string, from?: string) {
        try {
            this.logger.log(`Sending email to ${to}`);

            await this.transporter.sendMail({
                from: from || `"BlogSpace" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });

            this.logger.log(`Email sent successfully to ${to}`);
            return true;
        } catch (err) {
            this.logger.error(`Failed to send email: ${err.message}`);
            throw new InternalServerErrorException('Failed to send email');
        }
    }
}