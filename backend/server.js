import express from "express";

const app = express();

const port=process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.send("yes bro its ruunning");
});

app.get("/api/joke",(req,res)=>{ 
    const arrayjoke=[
        {
    "id": 1,
    "title": "A joke",
    "content": "This is a joke"
  },
  {
    "id": 2,
    "title": "Another joke",
    "content": "This is another joke"
  },
  {
    "id": 3,
    "title": "A third joke",
    "content": "This is a third joke"
  },
  {
    "id": 4,
    "title": "A fourth joke",
    "content": "This is a fourth joke"
  },
  {
    "id": 5,
    "title": "A fifth joke",
    "content": "This is a fifth joke"
  }
    ]
    res.send(arrayjoke);
});

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})