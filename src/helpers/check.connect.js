'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

// count connection
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connection: ${numConnection}`)
}

// check overload
const checkOverLoad = () =>{
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        // example maximum number of connections based on number of cores
        const maxConnections = numCores*5

        console.log(`Active Connection: ${numConnection}`)
        console.log(`Memory Usages: ${memoryUsage/1024/1024} MB`)
        if (numConnection > maxConnections)
        {
            console.log('Connection overload detected')
        }

    }, _SECONDS)
}

module.exports =  {
    countConnect,
    checkOverLoad
}