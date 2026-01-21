import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react'

function App() {
 
  const [count, setCount] = useState([])

useEffect(()=>{
        axios.get('/jokes')
  .then((response)=>{
     console.log(response.data)
     setCount(response.data)
  })
  .catch((error)=>{
    console.log(error)

  })
},[])
  
  return (
    <>
      <div>
        <h1>Jokes List={count.length}</h1>
        {
          count.map((jokes,id)=>{
            return(<div key={id}>
              <h3>{jokes.jokes}</h3>
              <h2>{jokes.name}</h2>
            </div>
            )
          })
        }
      </div>
    </>
  )
}

export default App
