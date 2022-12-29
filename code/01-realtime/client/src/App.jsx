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
      console.log(username)
      socket.emit('username', username)
      setConnected(true)
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
      socket.on('users', (users) => {
         setUsers(users)
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
            <div className="col-md-8">
               {messages.map((message, index) => (
                  <div
                     key={`${index}-${message}`}
                     className="alert alert-secondary"
                  >
                     {message}
                  </div>
               ))}
            </div>
            <div className="col-md-4">
               {users.map((user, index) => (
                  <div key={`${index}-${user}`} className="alert alert-primary">
                     ==>{user}
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default App
