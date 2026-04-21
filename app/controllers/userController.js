import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import sendEmail from '../services/email_service.js'

const normalizePhoneForStorage = (value) => {
    if (value === undefined || value === null) {
        throw new Error('Error! Phone is required!')
    }

    // Enforce string input so clients do not lose leading zeros via numeric coercion.
    if (typeof value !== 'string') {
        throw new Error('Error! Phone must be sent as text!')
    }

    const phone = value.trim()
    if (!phone) {
        throw new Error('Error! Phone is required!')
    }

    return phone
}

const formatText = (value, fallback = 'N/A') => {
    if (value === undefined || value === null) {
        return fallback
    }

    const text = String(value).trim()
    return text.length > 0 ? text : fallback
}

const isValidEmail = (value) => {
    if (value === undefined || value === null) {
        return false
    }

    const email = String(value).trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const UserController = {
    async index(req, res) {
        try {
            UserController.tryIndex(req, res)
        } catch (error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!'
            })
        }
    },
    async tryIndex(req, res) {
        const users = await User.findAll({
            attributes: [
                'id',
                'email',
                'phone',
                'fullname',
                'roleId',
                'verified',
                'active',
                'createdAt',
                'updatedAt'
            ]
        })
        res.status(200)
        res.json({
            success: true,
            data: users
        })
    },
    async show(req, res) {
        try {
            await UserController.tryShow(req, res)
        } catch (error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!'
            })
        }
    },
    async tryShow(req, res) {
        const user = await User.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: user
        })
    },
    async create(req, res) {
        var clientError = false;
        try {
            if (!req.body.email ||
                !req.body.password ||
                !req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! Bad request data!')
            }
            if (req.body.password != req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! The two password is not same!')
            }
            const user = await User.findOne({
                where: { name: req.body.email }
            })
            if (user) {
                clientError = true
                throw new Error('Error! User already exists: ' + user.email)
            }
            await UserController.tryCreate(req, res)
        } catch (error) {
            if (clientError) {
                res.status(400)
            } else {
                res.status(500)
            }
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryCreate(req, res) {
        const newUser = {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        }
        const userData = await User.create(newUser)
        res.status(201)
        res.json({
            success: true,
            data: userData
        })
    },
    async update(req, res) {
        var clientError = false;
        try {
            if (!req.body.email ||
                !req.body.phone ||
                !req.body.fullname ||
                req.body.roleId === undefined ||
                req.body.verified === undefined ||
                req.body.active === undefined) {
                clientError = true
                throw new Error('Error! Bad request data!')
            }
            await UserController.tryUpdate(req, res)
        } catch (error) {
            if (clientError) {
                res.status(400)
            } else {
                res.status(500)
            }
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryUpdate(req, res) {
        const user = await User.findByPk(req.params.id)
        const previousActive = Number(user.active)
        const normalizedPhone = normalizePhoneForStorage(req.body.phone)
        user.email = req.body.email
        user.phone = normalizedPhone
        user.fullname = req.body.fullname
        user.roleId = req.body.roleId
        user.verified = req.body.verified
        user.active = req.body.active
        await user.save()

        let emailWarning = null
        const isReactivated = previousActive === 0 && Number(req.body.active) === 1

        if (isReactivated) {
            try {
                const recipientEmail = user.email ? String(user.email).trim().toLowerCase() : null
                if (recipientEmail) {
                    await sendAccountReactivationConfirmation({
                        recipientEmail,
                        fullName: user.fullname,
                        reactivatedAt: new Date().toISOString()
                    })
                } else {
                    emailWarning = 'User reactivated, but no recipient email was provided.'
                }
            } catch (error) {
                emailWarning = 'User reactivated, but confirmation email could not be sent.'
                console.error('Email sending failed after user reactivation:', error.message)
            }
        }

        res.status(200)
        res.json({
            success: true,
            data: user,
            emailWarning
        })
    },

    async updatePassword(req, res) {
        var clientError = false;
        try {
            if (!req.body.password ||
                !req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! Bad request data!')
            } 
            if (req.body.password != req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! The two password is not same!')
            }
            await UserController.tryUpdatePassword(req, res)
        } catch (error) {
            if (clientError) {
                res.status(400)
            } else {
                res.status(500)
            }
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryUpdatePassword(req, res) {
        const user = await User.findByPk(req.params.id)
        user.password = bcrypt.hashSync(req.body.password)
        await user.save()
        res.status(200)
        res.json({
            success: true,
            data: user
        })
    },

    async destroy(req, res) {
        try {
            await UserController.tryDestroy(req, res)
        } catch (error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!'
            })
        }
    },
    async tryDestroy(req, res) {
        const existingUser = await User.findByPk(req.params.id)
        if (!existingUser) {
            res.status(404)
            return res.json({
                success: false,
                message: 'Error! User not found!'
            })
        }

        const recipientEmail = existingUser.email ? String(existingUser.email).trim().toLowerCase() : null
        const fullName = existingUser.fullname
        let emailWarning = null

        existingUser.active = 0
        await existingUser.save()

        try {
            if (recipientEmail) {
                await sendAccountDeletionConfirmation({
                    recipientEmail,
                    fullName,
                    deletedAt: new Date().toISOString()
                })
            } else {
                emailWarning = 'User deactivated, but no recipient email was provided.'
            }
        } catch (error) {
            emailWarning = 'User deactivated, but confirmation email could not be sent.'
            console.error('Email sending failed after user deactivation:', error.message)
        }

        res.status(200)
        res.json({
            success: true,
            message: 'User is deactivated successfully!',
            data: existingUser,
            emailWarning
        })
    },
    async adminRecipients(req, res) {
        try {
            await UserController.tryAdminRecipients(req, res)
        } catch (error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryAdminRecipients(req, res) {
        const users = await User.findAll({
            where: {
                roleId: 1,
                active: 1
            },
            attributes: ['id', 'email', 'roleId', 'active']
        })

        const recipients = users
            .filter((user) => isValidEmail(user.email))
            .map((user) => ({
                id: user.id,
                email: String(user.email).trim().toLowerCase(),
                roleId: user.roleId
            }))

        res.status(200)
        res.json({
            success: true,
            data: recipients
        })
    }
    
}
const sendAccountReactivationConfirmation = async ({ recipientEmail, fullName, reactivatedAt }) => {
    await sendEmail({
        email: recipientEmail,
        subject: 'Fiók újraaktiválva - Budapest Sporttelepek',
        html: `
            <h2>Fiók újraaktiválva</h2>
            <p>Kedves ${formatText(fullName, 'Felhasználó')}!</p>
            <p>A fiókod sikeresen újraaktiválásra került.</p>
            <ul>
                <li><strong>Email:</strong> ${formatText(recipientEmail)}</li>
                <li><strong>Aktiválás ideje:</strong> ${formatText(reactivatedAt)}</li>
            </ul>
            <p>Köszönjük, hogy ismét velünk vagy!</p>
        `
    })
}

const sendAccountDeletionConfirmation = async ({ recipientEmail, fullName, deletedAt }) => {
    await sendEmail({
        email: recipientEmail,
        subject: 'Fiók inaktiválása - Budapest Sporttelepek',
        html: `
            <h2>Fiók inaktiválása sikeres</h2>
            <p>Kedves ${formatText(fullName, 'Felhasználó')}!</p>
            <p>A fiókod sikeresen inaktiválásra került a rendszerből.</p>
            <ul>
                <li><strong>Email:</strong> ${formatText(recipientEmail)}</li>
                <li><strong>Inaktiválás ideje:</strong> ${formatText(deletedAt)}</li>
            </ul>
            <p>Ha ezt nem te kezdeményezted, vagy szeretnéd újra aktiválni a fiókodat, kérjük vedd fel velünk a kapcsolatot.</p>
        `
    })
}

export default UserController
