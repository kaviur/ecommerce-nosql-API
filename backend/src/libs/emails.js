import nodemailer from 'nodemailer';

import { email_host, email_port, email_secure, email_user, email_password } from '../config/config.js';

const transporter = nodemailer.createTransport({
    host: email_host,
    port: email_port,
    secure: email_secure,
    auth: {
        user: email_user,
        pass: email_password
    }
});

async function sendEmail(to, subject, text, html) {
    const mailOptions = {
        from: '"Fred Foo 👻" <nodoycorreos@gmail.com>',
        to: to,
        subject: subject,
        text: text,
        html: html
    };
    const send = await transporter.sendMail(mailOptions);
    
    console.log(send)

    return {success:true}
}

export default sendEmail;