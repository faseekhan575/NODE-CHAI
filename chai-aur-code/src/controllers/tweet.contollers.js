import { tweet } from "../models/tweet.models.js";
import { asynchandler } from "../utils/asynchandler.js";
import ApiResponse from "../utils/Api_Respoonse.js";
import { ApiError } from "../utils/ApiErrors.js";








      const createtweet=asynchandler(async(req,res)=>{
           const user=req.user._id
           const {tweetmessage}=req.body

           const createmake=await tweet.create({
              owner:user,
               content:tweetmessage
           })

           if (!createmake){
               return res.status(404).json(new ApiError(404,"cannot create tweet"))
        }
        else{
             return res.status(200).json(new ApiResponse(200,createmake,"tweet created sucesfully"))
        }
      })



      const getusertweet=asynchandler(async(req,res)=>{
        const user=req.user._id

        const findtweet=await tweet.find({
            owner:user
        }).select(
            "content"
        )
           if (findtweet.length===0){
               return res.status(404).json(new ApiError(404,"cannot create tweet"))
        }
        else{
             return res.status(200).json(new ApiResponse(200,findtweet,"tweet created sucesfully"))
        }

      })

      const updatetweet=asynchandler(async(req,res)=>{
          const {tweetid}=req.params
           const {tweetmessage}=req.body

           const update=await tweet.findByIdAndUpdate(
            tweetid,{
                $set:{
                    content:tweetmessage
                }
            },{new:true}
           )
                     if (!update){
               return res.status(404).json(new ApiError(404,"cannot update tweet"))
        }
        else{
             return res.status(200).json(new ApiResponse(200,update,"tweet updated sucesfully"))
        }
           
      })

      const deletetweet=asynchandler(async(req,res)=>{
            const {tweetid}=req.params

            const deletetweet=await tweet.findByIdAndDelete(
                tweetid
            )
                if (!deletetweet){
               return res.status(404).json(new ApiError(404,"cannot delete tweet"))
        }
        else{
             return res.status(200).json(new ApiResponse(200,deletetweet,"tweet delelted sucesfully"))
        }
      })

export{
    createtweet,
    getusertweet,
    updatetweet,
    deletetweet
}