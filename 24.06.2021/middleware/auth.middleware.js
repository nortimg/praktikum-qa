const jwt = require('jsonwebtoken')

// TODO: explain middleware
// TODO: differences between authorization and authentication
module.exports = function (req, res, next) {
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

        const decodedData = jwt.verify(token, 'secret')

        req.user = decodedData
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).json({
            message: 'You have to sign in.'
        })
    }
}