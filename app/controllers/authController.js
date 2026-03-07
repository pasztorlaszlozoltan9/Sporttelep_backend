import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import dotenvFlow from 'dotenv-flow'
import sendEmail from '../services/email_service.js'
import crypto from 'crypto'

dotenvFlow.config() 

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
        const envAppUrl = process.env.APP_URL?.trim()?.replace(/\/+$/, '')
        const apiBaseUrl = envAppUrl
            ? (envAppUrl.endsWith('/api') ? envAppUrl : `${envAppUrl}/api`)
            : `${req.protocol}://${req.get('host')}/api`
        const verifyUrl = `${apiBaseUrl}/verify-email/${verificationToken}`

        const user = {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            phone: req.body.phone,
            fullname: req.body.fullname,
            verificationToken: verificationToken
        }
        const result = await User.create(user)
        
        try {
            await sendEmail({
                email: req.body.email,
                subject: 'Regisztráció',
                html: `Regisztráció megerősítése:<br>
                ${verifyUrl}
                `
            })
        } catch (error) {
            console.error('Email send failed:', error.message)
        }

        res.status(201).json({
            succes: true,
            data: result
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
    }

}
 
export default AuthController
