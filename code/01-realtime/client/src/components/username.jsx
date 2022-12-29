
const Username=({handleUsername, username, setUsername})=>{

    return (
        <form onSubmit={handleUsername} className="text-center pt-3">
               <div className="row g-3">
                  <div className="col-md-8">
                     <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="enter your name"
                        className="form-control"
                     />
                  </div>
                  <div className="col-md-4">
                     <button type="submit" className="btn btn-secondary">
                        join
                     </button>
                  </div>
               </div>
            </form>
    )
}

export default Username