import express from 'express'
import { router } from './controllers'
const bodyParser = require('body-parser')

// Constants
const PORT = 8080
const HOST = '0.0.0.0'

// App
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello World hahaha')
})
app.use('/', router)

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
