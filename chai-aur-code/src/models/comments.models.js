import mongoose  from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const commentsschema =new mongoose.Schema({
    content:{
        type:String,
        required:true,

    },
     videos: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
      }
    ,
        owner:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"User",
           required:true,
        },


},{
    timestamps:true,
})

commentsschema.plugin(mongooseAggregatePaginate)

export const comment= mongoose.model('comment',commentsschema)