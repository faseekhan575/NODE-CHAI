const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/jokes',(req,res)=>{
       const jokesArray = [
  {
    id: 1,
    name: "hello",
    jokes: "My cat fell and now thinks I am a dog because I keep calling it to come back."
  },
  {
    id: 2,
    name: "hello",
    jokes: "I tried to exercise, but my body said error 404: motivation not found."
  },
  {
    id: 3,
    name: "hello",
    jokes: "I told my computer I needed a break, and it froze immediately."
  },
  {
    id: 4,
    name: "hello",
    jokes: "Why don’t programmers like nature? Too many bugs."
  },
  {
    id: 5,
    name: "hello",
    jokes: "I started coding to fix my life, now I just fix bugs all day."
  }
];
res.json(jokesArray);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
