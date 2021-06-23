const jwt = require('jsonwebtoken')

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            return next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1]

            if (!token) {
                return res.status(401).json({
                    message: 'You have to sign in.'
                })
            }

            const { roles: userRoles } = jwt.verify(token, 'secret')

            let hasRole = false
            userRoles.forEach(ur => {
                if (roles.includes(ur)) {
                    hasRole = true
                }
            })

            if (!hasRole) {
                return res.status(403).json({
                    message: 'You don\'t have the necessary permissions.'
                })
            }

            next()
        } catch (error) {
            console.error(error)
            return res.status(401).json({
                message: 'You have to sign in.'
            })
        }
    }
}