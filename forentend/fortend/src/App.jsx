import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

import './App.css'


function App() {
     const [jokes, setJokes] = useState([])


     useEffect(()=>{
        axios.get('/api/joke')
        .then((response)=>{
          setJokes(response.data)
          
        })
        
        .catch((error)=>{
          console.log("error", error);
        })
        
     },[])

  return (
    <>
    <h1>hello</h1>
    <h1>{jokes.length}</h1>
    

    {
      jokes.map((jokes,index)=>{
       return( <div key={index}>
          {console.log(jokes)}
        <h1>{jokes.title}</h1>
        <p>{jokes.content}</p>
     </div>)
      })
    }
    </>
  )
}

export default App
