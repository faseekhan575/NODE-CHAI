import mongoose from "mongoose";



const playlist= new mongoose.Schema({
    name:{
        type:string,
        required:true,
    },
    description:{
        type:string,
        required:true,
    },
   videos: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true
  }
],
    owner:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       required:true,
    },
    
},{
    timestamps:true,
})




export const video= mongoose.model('video',playlist)
