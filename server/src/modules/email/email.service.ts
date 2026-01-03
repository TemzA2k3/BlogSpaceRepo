import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private resend: Resend;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendMail(to: string, subject: string, html: string, from?: string) {
        try {
            this.logger.log(`Sending email to ${to}`);

            await this.resend.emails.send({
                from: from || 'BlogSpace <onboarding@resend.dev>',
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