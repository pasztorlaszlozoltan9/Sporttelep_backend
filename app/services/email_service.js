import nodemailer from 'nodemailer';

const parseBooleanEnv = (value, fallback) => {
    if (value === undefined) return fallback
    return String(value).toLowerCase() === 'true'
}

const stripSurroundingQuotes = (value) => {
    return String(value || '').trim().replace(/^['\"]|['\"]$/g, '')
}

const normalizeEmailUser = (value) => {
    return stripSurroundingQuotes(value).toLowerCase()
}

const normalizeEmailPassword = (host, password) => {
    const normalizedHost = String(host || '').toLowerCase()
    const normalizedPassword = stripSurroundingQuotes(password)

    if (normalizedHost.includes('gmail.com')) {
        return normalizedPassword.replace(/\s+/g, '')
    }

    return normalizedPassword
}

const sendEmail = async (options) => {
    const port = Number(process.env.EMAIL_PORT || 465)
    const host = process.env.EMAIL_HOST
    const transport = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user: normalizeEmailUser(process.env.EMAIL_USER),
            pass: normalizeEmailPassword(host, process.env.EMAIL_PASS)
        },
        tls: {
            rejectUnauthorized: parseBooleanEnv(process.env.EMAIL_TLS_REJECT_UNAUTHORIZED, true)
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        html: options.html
    }
    try {
        await transport.sendMail(mailOptions)
    } catch (error) {
        const isAuthError = error?.responseCode === 535 || String(error?.message || '').includes('5.7.8')
        if (isAuthError) {
            throw new Error('SMTP authentication failed (535). Check EMAIL_USER, use a Gmail App Password without spaces, and ensure 2-Step Verification is enabled on the Google account.')
        }
        throw error
    }
}

export default sendEmail