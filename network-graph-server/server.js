require('dotenv').config()
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const db = require('./src/queries')

const app = express()

const { PORT } = process.env

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/hubs-with-users', db.getHubsWithUsers)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))