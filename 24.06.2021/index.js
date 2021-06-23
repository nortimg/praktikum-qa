const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth.routes')

const PORT = process.env.PORT || 5000
const dbHost = process.env.DB_HOST || 'mongodb://localhost:27017/24-06-2021'

const app = express()
app.use(express.json())
app.use('/auth', authRoutes)


async function start() {
    try {
        app.listen(PORT, () => console.log(`Server has started on port ${PORT}`))
        await mongoose.connect(dbHost)
    } catch (error) {
        console.error(`Start error: ${error}`)
    }
}

start()