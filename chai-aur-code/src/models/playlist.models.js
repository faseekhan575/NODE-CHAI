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




export const playlists= mongoose.model('playlists',playlist)
