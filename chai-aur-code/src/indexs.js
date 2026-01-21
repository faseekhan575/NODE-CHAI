import dotenv from 'dotenv';
import connect from './db/index.js';

dotenv.config({
    path:'./.env'
    
});






connect()




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