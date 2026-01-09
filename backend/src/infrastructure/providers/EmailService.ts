import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }

})

export async function SendEMail(to: string, subject: string, text: string, html?: string) {
    await transporter.sendMail({
        from: `${process.env.SMTP_USER}`,
        to,
        subject,
        text,
        html
    })

}