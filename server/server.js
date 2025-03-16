const express = require('express')
const { default: AC } = require('./controllers/AppController')
const routes = require('./routes/index')

const app = express()
const port = 5000

app.get('/', (req, res) => {
    res.end("complte")
})

app.get('/status', (req, res) => {
    if (res){
        res.end(routes)
        console.log(routes)
    }
})

app.listen(port)
