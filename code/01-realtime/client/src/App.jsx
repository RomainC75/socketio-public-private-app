import socket from './socket'
import { useState, useEffect } from 'react'
import Username from './components/username'
import SendMessage from './components/sendMessage'

function App() {
   const [username, setUsername] = useState('')
   const [connected, setConnected] = useState(false)
   const [message, setMessage] = useState('')
   const [messages, setMessages] = useState([])
   const [users, setUsers] = useState([])

   const handleUsername = (e) => {
      e.preventDefault()
      // console.log(username)
      // socket.emit('username', username)
      // setConnected(true)

      // add the property "username"
      socket.auth = { username }
      // try to connect
      socket.connect()
      console.log(socket)

      setTimeout(() => {
         if (socket.connected) {
            console.log('socket.connected', socket)
            setConnected(true)
         }
      }, 300)
   }

   useEffect(() => {
      socket.on('user joined', (msg) => {
         console.log('user joined channel : ', msg)
      })
      socket.on('message', (msg) => {
         console.log('message receiced : ', msg)
         setMessages((previousMessages) => [...previousMessages, msg])
      })
      return () => {
         socket.off('user joined')
         socket.off('message')
      }
   }, [])

   useEffect(() => {
      socket.on('user connected', (user) => {
         
         user.connected = true
         user.messages = []
         user.hasNewMessages = false
         setUsers(previousUsers=>[...previousUsers, user])
         console.log(users)
      })

      socket.on('users', (users) => {
         users.forEach((user) => {
            user.self = user.userID === socket.id
            user.connected = true
            user.messages = []
            user.hasNewMessages = false
         })

         setUsers(users.sort((a,b)=>b.self))
      })

      socket.on('user disconnected', id=>{
         console.log(users)
         setUsers(previousUsers=>previousUsers.map(user=> {
            return {
               ...user,
               connected : user.userID===id ? false : user.connected      
            }
         }))
      })

      return () => {
         socket.off('users')
      }
      
   }, [socket])



   const handleMessage = (e) => {
      e.preventDefault()
      socket.emit('message', `${username} - ${message}`)
      setMessage('')
   }

   return (
      <div className="App container text-center">
          <div className="row">
            <div className="d-flex justify-content-evenly pt-2 pb-1">
                  {connected && users.map(user=>
                     <div key={user.userID}>
                        {user.username} {user.self && "(youself)"}
                     </div>)}
            </div>
         </div>

         <div className="row">
            {connected ? (
               <SendMessage
                  handleMessage={handleMessage}
                  message={message}
                  setMessage={setMessage}
               />
            ) : (
               <Username
                  handleUsername={handleUsername}
                  username={username}
                  setUsername={setUsername}
               />
            )}
         </div>
         <div className="row pt-3">
            <div className="col">
               {messages.map((message, index) => (
                  <div
                     key={`${index}-${message}`}
                     className="alert alert-secondary"
                  >
                     {message}
                  </div>
               ))}
            </div>
            
            {/* <div className="col-md-4">
               {users.map((user, index) => (
                  <div key={`${index}-${user}`} className="alert alert-primary">
                     "{JSON.stringify(user)}"
                  </div>
               ))}
            </div> */}

         </div>

         <div className="row">
            <p>{JSON.stringify(users)}</p>
         </div>
        
      </div>
   )
}

export default App
