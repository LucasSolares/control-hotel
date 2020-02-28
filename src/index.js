const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
dotenv.config()

const config = require('./config')
const routes = require('./network/routes')

const app = express()
app.use(express.static(path.resolve(config.PUBLIC_DIRECTORY)))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
routes.generateRoutes(app)

async function connectMongo() {

    try {
        const client = await mongoose.connect(config.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        process.on('SIGINT', () => {
            try {
                client.disconnect()
                console.log('MONGODB SUCCESFULY DISCONNECTED')
            } catch (error) {
                console.error('MONGO ERROR')
                console.error(error)
            }
        })
        console.log('MONGODB SUCCESFULY CONNECTED')
        initializeExpress()
    } catch (error) {
        console.error('MONGO ERROR')
        console.error(error)
    }

}

function initializeExpress() {

    app.listen(config.PORT, () => console.log(`The server is listen on http://${config.HOST}:${config.PORT}`))

}

connectMongo()