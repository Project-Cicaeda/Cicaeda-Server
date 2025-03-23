import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    private transporter = nodemailer.transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { 
                user: 'Projectcicaeda@gmail.com',  //For testing purposes used ethereal mail @ https://ethereal.email/
                pass: 'agem wfkj drdg qonp'
            }
        });
    }

    // async sendPasswordResetEmail(to: string, token: string) {
    //     const resetLink = `https://Cicaeda.com/reset-password?token=${token}`; //change according to front end url
    //     const mailOptions = {
    //         from: 'Auth-backend service',
    //         to: to,
    //         subject: 'Password Reset Request',
    //         html: `<p>You requested a password reset. Click the link below to reset your password: </p><p><a href="${resetLink}">Reset Password</a></p><p>If this was not you, please ignore this email.</p>`
    //     };

    //     await this.transporter.sendMail(mailOptions);
    // }

    async sendOTP( to: string, OTP: string) {
        const mailOptions = { 
            from: 'Auth-backend service',
            to: to,
            subject: 'OTP for password reset',
            html: `<p>Your OTP for password reset is:  <STRONG>${OTP}</STRONG> </p>
                   <p>This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>`
        };

        await this.transporter.sendMail(mailOptions);
    }
}

