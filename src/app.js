require('dotenv').config()
const compression = require('compression')
const express = require ('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()



// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended: true}))



// init db

require('./dbs/init.db')

// Init Router
app.use('',require('./routes'))
// Handling Error





module.exports = app 