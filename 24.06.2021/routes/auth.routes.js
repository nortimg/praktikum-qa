const router = require('express').Router()
const { check } = require('express-validator')

const controller = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')

router.post('/register', [
    check(['login', 'password'], 'The field cannot be empty.').notEmpty(),
    check('password', 'Password length must be greater than 4 and less than 8 characters.').isLength({ min: 4, max: 8 })
], controller.register)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['USER']), controller.getUsers)

module.exports = router