import express from 'express'
require('dotenv').config()
import chat from './controllers/chat'
import morgan from 'morgan'
import cors from 'cors'
//app
const app = express()

const http = require('http').createServer(app)

// socketio
const io = require('socket.io')(http, {
   //same path as the client
   path: '/socket.io',
   cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      allowedHeaders: ['content-type']
   },
})


//middlewares
app.use(cors)
app.use(express.json({limit: '5mb'}))
app.use(express.urlencoded({extended: true}))
app.use(morgan('combined'))

// rest api

app.get('/api',(req,res)=>{
    res.send('rest api !')
})

// connect to socket io
chat(io)


const port = process.env.PORT || 8000
http.listen(port, ()=>console.log(`server running on port : ${port}`))