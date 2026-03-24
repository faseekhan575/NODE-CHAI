import mongoose  from "mongoose";

const likesschema=new mongoose.Schema({
         comment:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment",
         }
         ,
          videos: 
               {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "Video",
                 required: true
               },
                 likeby:{
                      type:mongoose.Schema.Types.ObjectId,
                      ref:"User",
                      required:true,
                   },
                   tweet:{
                     type:mongoose.Schema.Types.ObjectId,
                      ref:"tweet",
                      required:true,
                   }
},{
    timestamps:true,
})

export const likes= mongoose.model('likes',likesschema)