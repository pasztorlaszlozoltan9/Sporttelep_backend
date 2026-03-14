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
        const users = await User.findAll()
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
                !req.body.password ||
                !req.body.phone ||
                !req.body.fullname ||
                req.body.roleId === undefined ||
                req.body.verified === undefined) {
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
        const normalizedPhone = normalizePhoneForStorage(req.body.phone)
        user.email = req.body.email
        // user.password = bcrypt.hashSync(req.body.password)
        user.phone = normalizedPhone
        user.fullname = req.body.fullname
        user.roleId = req.body.roleId
        user.verified = req.body.verified
        await user.save()
        res.status(200)
        res.json({
            success: true,
            data: user
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

        await existingUser.destroy()
        const deletedCount = 1

        try {
            if (recipientEmail) {
                await sendAccountDeletionConfirmation({
                    recipientEmail,
                    fullName,
                    deletedAt: new Date().toISOString()
                })
            } else {
                emailWarning = 'User deleted, but no recipient email was provided.'
            }
        } catch (error) {
            emailWarning = 'User deleted, but confirmation email could not be sent.'
            console.error('Email sending failed after user delete:', error.message)
        }

        res.status(200)
        res.json({
            success: true,
            message: 'User is deleted successfully!',
            data: deletedCount,
            emailWarning
        })
    }
    
}
const sendAccountDeletionConfirmation = async ({ recipientEmail, fullName, deletedAt }) => {
    await sendEmail({
        email: recipientEmail,
        subject: 'Fiók törlése - Budapest Sporttelepek',
        html: `
            <h2>Fiók törlése sikeres</h2>
            <p>Kedves ${formatText(fullName, 'Felhasználó')}!</p>
            <p>A fiókod sikeresen törlésre került a rendszerből.</p>
            <ul>
                <li><strong>Email:</strong> ${formatText(recipientEmail)}</li>
                <li><strong>Törlés ideje:</strong> ${formatText(deletedAt)}</li>
            </ul>
            <p>Ha ezt nem te kezdeményezted, kérjük vedd fel velünk a kapcsolatot.</p>
        `
    })
}

export default UserController
