import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import configService from '../config/config.service';
import * as hbs from 'nodemailer-express-handlebars';

@Injectable()
export class MailService {
    public transporter;
    constructor() {
        this.transporter = nodemailer.createTransport(
            configService.getNodemailerOptions()
        );
        this.transporter.use(
            'compile',
            hbs({
                viewEngine: {
                    defaultLayout: './src/views/main',
                },
                viewPath: './src/views/templates',
            })
        );
    }

    public async sendInviteMail(
        to: string,
        inviteLink: string,
        subject = 'Invite email',
        from = 'test@localhost'
    ) {
        const sent = await this.transporter.sendMail({
            to: to,
            from: from,
            subject: subject,
            template: 'invite-email',
            context: {
                inviteLink: inviteLink,
            },
        });
        return sent;
    }

    public async sendResetMail(
        to: string,
        resetLink: string,
        subject = 'Reset email',
        from = 'test@localhost'
    ) {
        const sent = await this.transporter.sendMail({
            to: to,
            from: from,
            subject: subject,
            template: 'reset-email',
            context: {
                resetLink: resetLink,
            },
        });
        return sent;
    }
}
