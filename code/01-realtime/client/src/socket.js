import { io } from 'socket.io-client'
const URL = 'http://localhost:8000'

const socket = io(URL, {
   path: '/socket.io',
   reconnection: false,
})

export default socket
