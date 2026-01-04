import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

@Injectable()
export class EmailService {
    private mailerSend: MailerSend;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        const apiKey = process.env.MAILERSEND_API_KEY;

        if (!apiKey) {
            this.logger.error('MAILERSEND_API_KEY is not defined!');
        } else {
            this.mailerSend = new MailerSend({ apiKey });
            this.logger.log('MailerSend initialized');
        }
    }

    async sendMail(to: string, subject: string, html: string, from?: string) {
        try {
            this.logger.log(`Sending email to ${to}`);

            const sentFrom = new Sender(
                process.env.MAILERSEND_FROM_EMAIL || 'noreply@trial-xxx.mlsender.net',
                'BlogSpace'
            );

            const recipients = [new Recipient(to)];

            const emailParams = new EmailParams()
                .setFrom(sentFrom)
                .setTo(recipients)
                .setSubject(subject)
                .setHtml(html);

            const response = await this.mailerSend.email.send(emailParams);

            this.logger.log(`Email sent successfully to ${to}`);
            return true;
        } catch (err: any) {
            this.logger.error(`Failed to send email: ${err.message}`);
            throw new InternalServerErrorException('Failed to send email');
        }
    }
}

