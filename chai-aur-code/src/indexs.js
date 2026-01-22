import dotenv from 'dotenv';
import connect from './db/index.js';
import app from './app.js';

dotenv.config({
    path:'./.env'
    
});


connect() 
.then(()=>{
      app.listen(process.env.PORT||4000,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
      })
})
.catch((err)=>{
    app.on('error',(err)=>{
       console.log(err);
    })
    console.log(err);
    process.exit(1);
    
})




/*
import express from 'express';
const app = express();
(async()=>{
    try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log("Connected to MongoDB");
    app.on('error',(error)=>{
        throw new Error('Failed to connect to MongoDB');
    })

    app.listen(process.env.Port,()=>{
        console.log(`Server is running on port ${process.env.Port}`);
    })
    } catch (error) {
        throw error;
    }
})()
*/