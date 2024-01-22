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



// init db

require('./dbs/init.db')

// Init Routeme
app.get('/', (req,res,next)=>{
    const strCompress = "Hi"
    return res.status(200).json({
        message: 'Hello World',
        //metadata: strCompress.repeat(100000)

    })
})

// Handling Error





module.exports = app 