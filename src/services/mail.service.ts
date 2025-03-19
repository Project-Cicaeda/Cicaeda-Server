import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    private transporter = nodemailer.transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: { 
                user: 'michael.wunsch83@ethereal.email',  //ethereal email and password
                pass: 'ar6EUPprfEHuGRPZ6e'
            }
        });
    }

    async sendPasswordResetEmail(to: string, token: string) {
        const resetLink = `http://yourapp.com/reset-password?token=${token}`;
        const mailOptions = {
            from: 'Auth-backend service',
            to: to,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password: </p><p><a href="${resetLink}">Reset Password</a></p><p>If this was not you, please ignore this email.</p>`
        };

        await this.transporter.sendMail(mailOptions);
    }
}

