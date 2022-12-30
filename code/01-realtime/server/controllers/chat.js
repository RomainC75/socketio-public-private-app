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

   //middleware
   io.use((socket, next) => {
      // get the "username" sent with socket.auth from the front

      const username = socket.handshake.auth.username
      if (!username) {
         return next(new Error('invalid username'))
      }
      socket.username = username
      next()
   })

   io.on('connection', (socket) => {
      // console.log('socket io ', socket.id)

      // socket.on('username', (username, next) => {
      //    console.log('username : ', username)
      //    if (!addUser(username)) {
      //       return next('user name not valid')
      //    }
      //    //to everyone
      //    io.emit('users', users)
      //    // everyone BUT the sender
      //    socket.broadcast.emit('user joined', ` BROADCAST ${username} joined`)
      // })

      // socket.on('message', (message) => {
      //    console.log('message received : ', message)
      //    io.emit('message', message)
      // })

      
      let users = []
      for (let [id, socket] of io.of('/').sockets) {
         const existingUser = users.find(
            (user) => user.username === socket.username
            )
            if (existingUser) {
               socket.emit('username take')
               socket.disconnect()
            } else {
               users.push({
                  userID: id,
                  username: socket.username,
               })
            }
         }
         // notify the existing users
         socket.emit('users', users)
         
         socket.broadcast.emit('user connected', {
            userID: socket.id,
            username: socket.username
         })
         
         //disconnect
         socket.on('disconnect', () => {
            socket.broadcast.emit('user disconnected',socket.id)

         })
      })
   }
   
   export default chat
   