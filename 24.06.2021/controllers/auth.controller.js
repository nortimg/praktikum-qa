const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const Role = require('../models/Role')

const generateAccessToken = (id, roles) => {
    const payload = { id, roles }

    // TODO: put secret key and other meta into env 
    return jwt.sign(payload, 'secret', { expiresIn: '24h' })
}

// TODO: Write as promises on the webinar
class AuthController {
    async register(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Register error', ...errors })
            }

            const { login, password } = req.body
            const candidate = await User.findOne({ login })

            if (candidate) {
                return res.status(400).json({
                    message: 'Such user has already been existed.'
                })
            }

            const userRole = await Role.findOne({ value: 'USER' })
            const user = new User({ login, password: bcrypt.hashSync(password, 7), roles: [userRole.value] })
            await user.save()
            return res.json({ message: 'User has been successfully created.' })
        } catch (error) {
            // TODO: make custom errors 
            return res.status(400).json({
                message: 'Registration failed'
            })
        }
    }

    async login(req, res) {
        try {
            const { login, password } = req.body
            const user = await User.findOne({ login })

            if (!user) {
                return res.status(404).json({
                    message: 'Such user doesn\'t exist.'
                })
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password)

            if (!isPasswordCorrect) {
                return res.status(400).json({
                    message: 'Incorrect login or password'
                })
            }

            const token = generateAccessToken(user._id, user.roles)

            return res.json({token})
        } catch (error) {
            // TODO: make custom errors 
            return res.status(400).json({
                message: 'Login failed'
            })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()

            return res.json({
                users
            })
        } catch (error) {
            console.error(`AuthController.getUsers error: ${error}`)
        }
    }

    // TODO: one more method to create admin
}

module.exports = new AuthController()