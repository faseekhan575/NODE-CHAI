import { comment } from "../models/comments.models";
import { asynchandler } from "../utils/asynchandler";
import ApiResponse from "../utils/Api_Respoonse";
import { ApiError } from "../utils/ApiErrors";

const getallvideocomments=asynchandler(async(req,res)=>{
        const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

     const allcomments=await comment.find({
         videos:videoId
       }).skip((page-1)*limit)
       .limit(limit).populate({
           path:"owner",
           select:"usernamen avatar"
       })

       if (allcomments.length===0){
         return res.status(404).json(new ApiError(404,"comments not found"))
       }
       else{
         return res.status(200).json(new ApiResponse(200,allcomments,"all comments has been fetchd sucesully "))
       }

})


const addacomment=asynchandler(async(req,res)=>{
    const comments=req.body
    const {videoId} = req.params

    if (!comments || !comments.content){
         return res.status(404).json(new ApiError(404,"plz add a comemnt first"))
    }
    else{
    const addcomment=await comment.create({
        content:comments.content,
        videos:videoId,
        owner:req.user._id
    })

    if (!addcomment){
        return res.status(404).json(new ApiError(404,"server error failed to uplode a comment"))
    }
    else{
         return res.status(200).json(new ApiResponse(200,addcomment,"comment has been added sucesfully "))
    }
}
})

const updateacomment=asynchandler(async(req,res)=>{
    const comments=req.body
    const {commentId} = req.params

    if (!comments || !comments.content){
         return res.status(404).json(new ApiError(404,"plz add a comemnt first"))
    }
    else{
    const updatecomment=await comment.findByIdAndUpdate(
        commentId,{
            $set:{
                 content:comments.content
            },
        },{new:true}
    )
    if (!updatecomment){
        return res.status(404).json(new ApiError(404,"server issue failed to update comment"))
    }
    else{
         return res.status(200).json(new ApiResponse(200,updatecomment,"comment has been updated sucesfully "))
    }
}
})


const deleteacomment=asynchandler(async(req,res)=>{
  
    const {commentId} = req.params
    
    const deleteacomment=await comment.findByIdAndDelete(
        commentId)
    if (!deleteacomment){
        return res.status(404).json(new ApiError(404,"server issue failed to update comment"))
    }
    else{
         return res.status(200).json(new ApiResponse(200,deleteacomment,"comment has been updated sucesfully "))
    }

})

export{
    addacomment,
    updateacomment,
    deleteacomment,
    getallvideocomments
}