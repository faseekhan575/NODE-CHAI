import mongoose from "mongoose";



const playlist= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
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
