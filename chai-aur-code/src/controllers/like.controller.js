import { comment } from "postcss";
import { likes } from "../models/likes.model.js";
import ApiResponse from "../utils/Api_Respoonse.js";
import { asynchandler } from "../utils/asynchandler.js";





    const likeonvideo=asynchandler(async(req,res)=>{
        const {videoid}=req.params
        const userid=req.user._id
      
        const checklike=await likes.findOne({
             videos:videoid,
             likeby:userid,
        })
        if (checklike){
            await likes.findByIdAndDelete(checklike._id)
           return res.status(200).json(new ApiResponse(200,null,"video dislikes"))
        }
        else{
           const likeby= await likes.create({
                 videos:videoid,
             likeby:userid,
            })
            if (!likeby){
                return res.status(404).json(new ApiError(404,"failed to dislike video"))

            }
            else{
              return res.status(200).json(new ApiResponse(200,likeby,"video liked"))
            }
        }
    })


    
    const togglecommentlike=asynchandler(async(req,res)=>{
        const {commentId}=req.params
        const userid=req.user._id
      
        const checkcommentlike=await likes.findOne({
             comment:commentId,
             likeby:userid,
        })

        if (checkcommentlike){
            await likes.findByIdAndDelete(checkcommentlike._id)
           return res.status(200).json(new ApiResponse(200,null,"comment dislike"))
        }
        else{
           const likeby= await likes.create({
                comment:commentId,
             likeby:userid,
            })
            if (!likeby){
                return res.status(404).json(new ApiError(404,"failed to dislike comment"))

            }
            else{
              return res.status(200).json(new ApiResponse(200,likeby,"comment liked"))
            }
        }
    })

        const toggletweettlike=asynchandler(async(req,res)=>{
        const {tweetId}=req.params
        const userid=req.user._id
      
        const cheecktweetlike=await likes.findOne({
             tweet:tweetId,
             likeby:userid,
        })

        if (cheecktweetlike){
            await likes.findByIdAndDelete(cheecktweetlike._id)
           return res.status(200).json(new ApiResponse(200,null,"tweet dislike"))
        }
        else{
           const likeby= await likes.create({
               tweet:tweetId,
             likeby:userid,
            })
            if (!likeby){
                return res.status(404).json(new ApiError(404,"failed to dislike tweet"))

            }
            else{
              return res.status(200).json(new ApiResponse(200,likeby,"tweet liked"))
            }
        }
    })


    const getalllikedvideos=asynchandler(async(req,res)=>{
         const userid=req.user._id

         const likedvideo=await likes.find({
              likeby:userid,
         }).select(
            "videos"
         )

         if (likedvideo.length===0){
                 return res.status(200).json(new ApiResponse(200,"no likes videos"))
       }
       else{
         return res.status(200).json(new ApiResponse(200,likedvideo,"all liked videos found"))
       } 
         
    })

    export{
        likeonvideo,
        togglecommentlike,
        toggletweettlike,
        getalllikedvideos
    }