import { createTransport } from 'nodemailer'
import { config } from 'dotenv';

export const sendEmail = async (email, subject, text) => {
    try {
        const transporter = createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        })
        console.log("email sent successfully")
    } catch (error) {
        throw new Error(error)
    }
}