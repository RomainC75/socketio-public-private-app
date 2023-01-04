import React, {useState} from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import { css } from '@emotion/css'
import SendMessage from './sendMessage'
import Username from './username'


const ROOT_CSS = css({
   height: 600,
   width: window.innerWidth / 2,
})

export const PrivateMessage = ({
   connected,
   handlePrivateMessage,
   privateMessage,
   setPrivateMessage,
   setUsername,
   username,
   messages,
   typing,
   handleUsername,
   selectedUser
}) => {
    
   return (
      <>
         <div className="row">
            {connected && (
               <div className="col-md-6">
                  <SendMessage
                     handleMessage={handlePrivateMessage}
                     message={privateMessage}
                     setMessage={setPrivateMessage}
                  />

                  <br />
                  <div className="col-md-6"> ==>PRIVATE chat</div>
               </div>
            )}
         </div>s
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
                  {/* {JSON.stringify(selectedUser, null, 4)} */}
                  {selectedUser && selectedUser.messages && selectedUser.messages.map((msg,index)=>
                    <div key={index} className="alert alert-secondary">{msg.fromSelf ? "(yourself)" : selectedUser.username.charAt(0).toUpperCase()+selectedUser.username.slice(1)+" "}
                    {" - "}
                    {msg.message}</div>
                  )}
               </ScrollToBottom>
            </div>
            <br />

            {typing && <span className="error">{typing}</span>}
         </div>
      </>
   )
}
