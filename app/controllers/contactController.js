import User from '../models/user.js'
import sendEmail from '../services/email_service.js'

const isValidEmail = (value) => {
    if (value === undefined || value === null) {
        return false
    }

    const email = String(value).trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const normalizeEmail = (value) => {
    return String(value || '').trim().toLowerCase()
}

const escapeHtml = (value) => {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

const resolveAdminEmails = async () => {
    const admins = await User.findAll({
        where: {
            roleId: 1,
            active: 1
        },
        attributes: ['email']
    })

    const normalized = admins
        .map((admin) => admin?.email)
        .filter((email) => isValidEmail(email))
        .map((email) => normalizeEmail(email))

    return Array.from(new Set(normalized))
}

const ContactController = {
    async send(req, res) {
        try {
            await ContactController.trySend(req, res)
        } catch (error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! Contact request failed!',
                error: error.message
            })
        }
    },
    async trySend(req, res) {
        const senderEmail = normalizeEmail(req.body?.email)
        const message = String(req.body?.message || '').trim()

        if (!isValidEmail(senderEmail) || !message) {
            return res.status(400).json({
                success: false,
                message: 'Error! Bad request data! email and message are required.'
            })
        }

        const adminEmails = await resolveAdminEmails()
        if (!adminEmails.length) {
            return res.status(200).json({
                success: true,
                data: {
                    senderEmail,
                    deliveredTo: []
                },
                emailWarning: 'No active admin recipients with valid email were found.'
            })
        }

        const subject = 'Kapcsolatfelvétel - Üzenet a weboldalról'
        const html = `
            <h2>Új kapcsolatfelvétel</h2>
            <p><strong>Feladó email:</strong> ${escapeHtml(senderEmail)}</p>
            <p><strong>Üzenet:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `

        const sendResults = await Promise.allSettled(
            adminEmails.map((recipientEmail) => sendEmail({
                email: recipientEmail,
                subject,
                html
            }))
        )

        const deliveredTo = []
        const failedTo = []

        sendResults.forEach((result, index) => {
            const recipientEmail = adminEmails[index]
            if (result.status === 'fulfilled') {
                deliveredTo.push(recipientEmail)
            } else {
                failedTo.push(recipientEmail)
            }
        })

        let emailWarning = null
        if (failedTo.length > 0) {
            emailWarning = `Contact message saved for processing, but ${failedTo.length} admin email(s) could not be sent.`
        }

        if (!deliveredTo.length) {
            return res.status(500).json({
                success: false,
                message: 'Error! Contact email sending failed for all admin recipients.',
                data: {
                    senderEmail,
                    deliveredTo,
                    failedTo
                },
                emailWarning
            })
        }

        res.status(200)
        res.json({
            success: true,
            data: {
                senderEmail,
                deliveredTo,
                failedTo
            },
            emailWarning
        })
    }
}

export default ContactController