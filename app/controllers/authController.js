import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import dotenvFlow from 'dotenv-flow'
import sendEmail from '../services/email_service.js'
import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'

dotenvFlow.config() 

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const normalizePhone = (value) => {
    if (value === undefined || value === null) return null
    const phone = String(value).trim()
    return phone.length > 0 ? phone : null
}

const AuthController = {
    async register(req, res) {        
        var clientError = false;
        try {
            if(!req.body.email ||
                !req.body.password ||
                !req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! Bad request data!')
            }
            if(req.body.password != req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! The two password is not same!')
            }
            const user = await User.findOne({
                where: { email: req.body.email }
            })
            if(user) {
                clientError = true
                throw new Error('Error! User already exists: ' + user.email)
            }
            await AuthController.tryRegister(req, res)
        } catch (error) {
            if (clientError) {
                res.status(400)
            }else {
                res.status(500)
            }            

            await res.json({
                success: false,
                message: 'Error! User creation failed!',
                error: error.message
            })            
        }
    },
    async tryRegister(req, res) {
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const verifyUrl = process.env.APP_URL + '/verify-email/' + verificationToken

        const user = {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            phone: req.body.phone,
            fullname: req.body.fullname,
            verificationToken: verificationToken
        }
        const result = await User.create(user)

        let emailWarning = null
        try {
            await sendEmail({
                email: req.body.email,
                subject: 'Regisztráció - Budapest Sporttelepek',
                html: `Kedves ${req.body.fullname}!<br><br> Köszönjük regisztrációját. 
                Megerősítéshez és az oldal használatához kattintson az alábbi linkre:<br>
                ${verifyUrl}
                <br>Budapest Sporttelepek csapata<br>`
            })
        } catch (error) {
            emailWarning = 'User created, but verification email could not be sent.'
            console.error('Email sending failed during registration:', error.message)
        }

        res.status(201).json({
            succes: true,
            data: result,
            emailWarning
        })
        
    },
    async login(req, res) {
        
        try {
            console.log('Login attempt: ' + req.body.email);
            if(!req.body.email || !req.body.password ) {
               res.status(400)
               throw new Error('Error! Bad email or password!')
            }
            const user = await User.findOne({
                where: { email: req.body.email }
            })

            if(!user) {
                res.status(404)
                throw new Error('Error! User not found!')
            }
            var passwordIsValid = await bcrypt.compare(
                req.body.password,
                user.dataValues.password
            );
            if(!passwordIsValid) {
                res.status(401)
                throw new Error('Error! Password is not valid!')
            }
            AuthController.tryLogin(req, res, user)

        } catch (error) {
            res.json({
                success: false,
                message: 'Error! The login is failed!',
                error: error.message
            })
        }
    },
    async googleSignIn(req, res) {
        try {
            const idToken = req.body.idToken || req.body.credential
            if (!idToken) {
                res.status(400)
                throw new Error('Error! Missing Google ID token!')
            }

            if (!process.env.GOOGLE_CLIENT_ID) {
                res.status(500)
                throw new Error('Error! GOOGLE_CLIENT_ID is not configured on the backend!')
            }

            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            const payload = ticket.getPayload()

            if (!payload || !payload.email) {
                res.status(401)
                throw new Error('Error! Invalid Google token payload!')
            }

            if (!payload.email_verified) {
                res.status(401)
                throw new Error('Error! Google account email is not verified!')
            }

            const email = String(payload.email).toLowerCase().trim()
            const fullname = payload.name || req.body.fullname || email.split('@')[0]
            const phone = normalizePhone(
                req.body.phone ||
                req.body.phoneNumber ||
                req.body?.user?.phone ||
                payload.phone_number
            ) || '0'

            let user = await User.findOne({ where: { email } })

            if (!user) {
                user = await User.create({
                    email,
                    fullname,
                    phone,
                    password: bcrypt.hashSync(crypto.randomBytes(32).toString('hex')),
                    verified: true,
                    verificationToken: null
                })
            } else {
                let shouldSave = false
                const existingPhone = normalizePhone(user.phone)
                const incomingPhone = normalizePhone(phone)

                if (!user.verified) {
                    user.verified = true
                    user.verificationToken = null
                    shouldSave = true
                }

                if (incomingPhone && (existingPhone === null || existingPhone === '0')) {
                    user.phone = incomingPhone
                    shouldSave = true
                }

                if (shouldSave) {
                    await user.save()
                }
            }

            return AuthController.tryLogin(req, res, user)
        } catch (error) {
            if (!res.statusCode || res.statusCode < 400) {
                res.status(500)
            }

            return res.json({
                success: false,
                message: 'Error! Google sign-in failed!',
                error: error.message
            })
        }
    },
    async tryLogin(req, res, user) {
        var token = jwt.sign({ id: user.id }, process.env.APP_KEY, {
            expiresIn: 86400 //24 óra
        })
        res.status(200).json({
            id: user.id,
            email: user.email,
            accessToken: token
        })            
    },

    async verifyEmail(req, res) {
        const user = await User.findOne({
            where: { verificationToken: req.params.token }
        })
        if(!user) {
            res.status(404)
            throw new Error('Error! User not found!')
        }
        user.verified = true
        await user.save()
        
        res.status(200).json({
            success: true,
            message: 'The email is verified!',
        })
    },

    async forgotPassword(req, res) {
        try {
            if (!req.body.email) {
                res.status(400)
                return res.json({ success: false, message: 'Error! Email is required!' })
            }

            const user = await User.findOne({ where: { email: req.body.email } })

            // Always respond the same way to avoid user enumeration
            if (!user) {
                return res.status(200).json({
                    success: true,
                    message: 'If an account with that email exists, a password reset link has been sent.'
                })
            }

            const resetToken = crypto.randomBytes(32).toString('hex')
            user.passwordResetToken = resetToken
            user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
            await user.save()

            const resetUrl = process.env.APP_URL + '/reset-password/' + resetToken

            await sendEmail({
                email: user.email,
                subject: 'Jelszó visszaállítás - Budapest Sporttelepek',
                html: `
                    <h2>Jelszó visszaállítás</h2>
                    <p>Kedves ${user.fullname || 'Felhasználó'}!</p>
                    <p>Jelszó visszaállítási kérelmet kaptunk a fiókodhoz.</p>
                    <p>Kattints az alábbi linkre a jelszavad megváltoztatásához (1 óráig érvényes):</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <p>Ha nem te kérted ezt, hagyd figyelmen kívül ezt az emailt.</p>
                    <p>Budapest Sporttelepek csapata</p>
                `
            })

            res.status(200).json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error! Password reset request failed!',
                error: error.message
            })
        }
    },

    async resetPassword(req, res) {
        try {
            if (!req.body.password || !req.body.password_confirmation) {
                res.status(400)
                return res.json({ success: false, message: 'Error! Bad request data!' })
            }

            if (req.body.password !== req.body.password_confirmation) {
                res.status(400)
                return res.json({ success: false, message: 'Error! The two passwords are not the same!' })
            }

            const user = await User.findOne({
                where: { passwordResetToken: req.params.token }
            })

            if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
                res.status(400)
                return res.json({ success: false, message: 'Error! Reset token is invalid or has expired.' })
            }

            user.password = bcrypt.hashSync(req.body.password)
            user.passwordResetToken = null
            user.passwordResetExpires = null
            await user.save()

            res.status(200).json({
                success: true,
                message: 'Password has been reset successfully!'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error! Password reset failed!',
                error: error.message
            })
        }
    }

}
 
export default AuthController
