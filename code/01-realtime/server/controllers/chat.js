
const users = []
const addUser = (username) => {
   const name = username.trim().toLowerCase()
   if (users.includes(name) || !name.trim()) {
      return false
   }
   users.push(name)
   return true
}

const chat = (io) => {
   console.log('live chat ==>', io.opts)

   
   io.on('connection', (socket) => {
      // console.log('socket io ', socket.id)
      socket.on('username', (username, next) => {
         console.log('username : ', username)
         if (!addUser(username)) {
            return next('user name not valid')
         }
         //to everyone
         io.emit('users', users)
         // everyone BUT the sender
         socket.broadcast.emit('user joined', ` BROADCAST ${username} joined`)
      })

      socket.on('message', (message) => {
         console.log('message received : ', message)
         io.emit('message', message)
      })
      
      //disconnect
      socket.on('disconnect', () => {
         console.log('user disconnected ! ')
      })
   })
}

export default chat
