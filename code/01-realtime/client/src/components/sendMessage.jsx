import React from 'react'

const SendMessage = ({handleMessage, message, setMessage}) => {
   return (
      
      <form onSubmit={handleMessage} className="text-center pt-3 send message">
         <div className="row g-3">
            <div className="col-10">
               <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                  placeholder="enter your message"
                  className="form-control"
               />
            </div>
            <div className="col-2">
               <button type="submit" className="btn btn-secondary">
                  send message
               </button>
            </div>
         </div>
      </form>
   )
}

export default SendMessage