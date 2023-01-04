import socket from './socket'
import { useState, useEffect } from 'react'
import Username from './components/username'
import SendMessage from './components/sendMessage'
import toast, { Toaster } from 'react-hot-toast'
import ScrollToBottom from 'react-scroll-to-bottom'
import { css } from '@emotion/css'
import { PrivateMessage } from './components/privateMessage'
// const notify = (username) => toast(`new user : ${username}`)

const ROOT_CSS = css({
   height: 600,
   width: window.innerWidth / 2,
})

function App() {
   const [username, setUsername] = useState('')
   const [connected, setConnected] = useState(false)
   const [message, setMessage] = useState('')
   const [messages, setMessages] = useState([])
   const [users, setUsers] = useState([])
   const [typing, setTyping] = useState('')
   const [selectedUser, setSelectedUser] = useState(null)
   // private message
   const [privateMessage, setPrivateMessage] = useState('')

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
         // setMessages((previousMessages) => [...previousMessages, msg])
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
         setUsers((previousUsers) => [...previousUsers, user])
         // notify(user.username)
         toast.success(`new user : ${user.username}`)
         console.log(users)
      })

      socket.on('users', (users) => {
         users.forEach((user) => {
            user.self = user.userID === socket.id
            user.connected = true
            user.messages = []
            user.hasNewMessages = false
         })

         setUsers(users.sort((a, b) => b.self))
      })

      socket.on('user disconnected', (id) => {
         console.log(users)
         toast.error(`${id} disconnected`)
         setUsers((previousUsers) =>
            previousUsers.map((user) => {
               return {
                  ...user,
                  connected: user.userID === id ? false : user.connected,
               }
            })
         )
      })

      socket.on('username taken', () => {
         toast.error('username taken')
      })

      // useEffect(() => {
      //   {user disconnected}

      // }, [socket,users])

      return () => {
         socket.off('users')
         socket.off('user connected')
         socket.off('username taken')
      }
   }, [socket])

   const handleMessage = (e) => {
      e.preventDefault()
      socket.emit('message', {
         id: Date.now(),
         name: username,
         message,
      })
      setMessage('')
   }
   //typing ...
   if (message) {
      socket.emit('typing', username)
   }

   const handlePrivateMessage = (e) => {
      e.preventDefault()
      console.log('sending private message')
      if (selectedUser) {
         socket.emit('private message', {
            id: Date.now(),
            name: username,
            to: selectedUser.userID,
            message: privateMessage,
         })
      }
      let updated = selectedUser
      updated.messages.push({
         message: privateMessage,
         fromSelf: true,
         hasNewMessages: false,
      })
      setSelectedUser(updated)
      setPrivateMessage('')
   }

   useEffect(() => {
      socket.on('typing', (username) => {
         setTyping(`${username} is typing...`)
         setTimeout(() => {
            setTyping('')
         }, 1000)
      })
      return () => {
         socket.off('typing')
      }
   }, [])

   useEffect(() => {
      socket.on('private message', ({ message, from }) => {
         console.log('incoming message ! ', `message from ${from} : ${message}`)
         const allUsers = users
         let index = allUsers.findIndex((usr) => usr.userID === from)
         let foundUser = allUsers[index]

         foundUser.messages.push({
            message,
            fromSelf: false,
         })

         if (foundUser) {
            if (selectedUser) {
               if (foundUser.userID !== selectedUser.userID) {
                  foundUser.hasNewMessages = true
               }
            } else {
               foundUser.hasNewMessages = true
            }
            allUsers[index] = foundUser
            setUsers([...allUsers])
         }
      })
      return () => {
         socket.off('private message')
      }
   }, [users])

   const handleUserNameClick = (user) => {
      if (user.self || !user.connected) {
         return
      }
      setSelectedUser({ ...user, hasNewMessages: false })
      let allUsers = users
      let foundIndex = allUsers.findIndex((u) => u.userID === user.userID)
      let foundUser = allUsers[foundIndex]
      foundUser.hasNewMessages = false

      allUsers[foundIndex] = foundUser
      setUsers([...allUsers])
   }

   return (
      <div className="App container text-center">
         <Toaster />
         <div className="row">
            <div className="d-flex justify-content-evenly pt-2 pb-1">
               {connected &&
                  users.map((user) => (
                     <div
                        key={user.userID}
                        onClick={() => handleUserNameClick(user)}
                     >
                        {`${user.username
                           .charAt(0)
                           .toUpperCase()}${user.username.slice(1)}`}{' '}
                        {user.self && '(youself)'}
                        {user.connected ? (
                           <span className="online-dot"></span>
                        ) : (
                           <span className="offline-dot"></span>
                        )}
                        {user.hasNewMessages && (
                           <b className="text-danger">_ _ _</b>
                        )}
                        {user.hasNewMessages && (
                           <b className="text-danger">
                              {user.hasNewMessages && user.messages.length}
                           </b>
                        )}
                     </div>
                  ))}
            </div>
         </div>

         {/* {
               !connected && <Username handleUsername={handleUsername} username={username} setUsername={setUsername}/>
            } */}
         <div className="row">
            {connected && (
               <div className="col-md-6">
                  <SendMessage
                     handleMessage={handleMessage}
                     message={message}
                     setMessage={setMessage}
                  />

                  <br />
                  <div className="col-md-6">private chat</div>
               </div>
            )}
         </div>
         <div className="row">
            {!connected && (
               <div className="col-md-6">
                  <Username
                     handleUsername={handleUsername}
                     username={username}
                     setUsername={setUsername}
                  />
               </div>
            )}
         </div>

         <div className="row pt-3">
            <div className="col-md-6">
               <ScrollToBottom className={ROOT_CSS}>
                  {messages.map((data, index) => (
                     <div
                        key={`${index}-${data.id}`}
                        className="alert alert-secondary"
                     >
                        {`${data.name.charAt(0).toUpperCase()}${data.name.slice(
                           1
                        )} - ${data.message}`}
                     </div>
                  ))}
               </ScrollToBottom>
            </div>
            <br />
            {typing && <span className="error">{typing}</span>}
         </div>

         <p>mlksdjf</p>
         {selectedUser && (
            <PrivateMessage
               connected={connected}
               handlePrivateMessage={handlePrivateMessage}
               privateMessage={privateMessage}
               setPrivateMessage={setPrivateMessage}
               setUsername={setUsername}
               handleUsername={handleUsername}
               username={username}
               messages={messages}
               typing={typing}
               selectedUser={selectedUser}
            />
         )}
         <div className="row">
            <p>{JSON.stringify(selectedUser)}</p>
         </div>
      </div>
   )
}

export default App
