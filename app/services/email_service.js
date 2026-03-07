import nodemailer from 'nodemailer';
import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

const emailPort = Number(process.env.EMAIL_PORT || 587)
const emailSecure = process.env.EMAIL_SECURE === 'true' || emailPort === 465
const rejectUnauthorized = process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== 'false'

const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: emailPort,
    secure: emailSecure,
    tls: {
        rejectUnauthorized
    },
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendEmail = async (options) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        html: options.html
    }
    await transport.sendMail(mailOptions)
}

export default sendEmail