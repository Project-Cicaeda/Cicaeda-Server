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
                user: '',  //ethereal email and password
                pass: ''
            }
        });
    }
}

