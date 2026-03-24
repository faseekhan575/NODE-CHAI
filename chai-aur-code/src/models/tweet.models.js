import mongoose, { Schema } from "mongoose";

const tweetschema = new mongoose.Schema({
        owner:{
           type:Schema.Types.ObjectId,
           ref:"User"
        },
        content:{
           type:String,
            required:true,
        }
},{timestamps:true})


export const tweet= mongoose.model('tweet',tweetschema)