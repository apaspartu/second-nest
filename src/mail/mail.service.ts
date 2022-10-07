import {Injectable} from "@nestjs/common";
import * as nodemailer from 'nodemailer'
import configService from "../config/config.service";

@Injectable()
export class MailService {
    public transporter;
    constructor() {
        this.transporter = nodemailer.createTransport(configService.getNodemailerOptions());
    }

    public async sendMail(to: string, text: string, subject='Test', from='test@localhost', ) {
        const sent = await this.transporter.sendMail(
            {
                to: to,
                from: from,
                subject: subject,
                text: text
            });
        return sent;
    }
}