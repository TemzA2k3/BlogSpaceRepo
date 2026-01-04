import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.elasticemail.com',
            port: 2525,
            secure: false,
            auth: {
                user: process.env.ELASTIC_USER,
                pass: process.env.ELASTIC_API_KEY,
            },
        });

        this.logger.log('Elastic Email SMTP initialized');
    }

    async sendMail(to: string, subject: string, html: string, from?: string) {
        try {
            this.logger.log(`Sending email to ${to}`);

            await this.transporter.sendMail({
                from: from || `"BlogSpace" <${process.env.ELASTIC_FROM_EMAIL}>`,
                to,
                subject,
                html,
            });

            this.logger.log(`Email sent successfully to ${to}`);
            return true;
        } catch (err: any) {
            this.logger.error(`Failed to send email: ${err.message}`);
            throw new InternalServerErrorException('Failed to send email');
        }
    }
}