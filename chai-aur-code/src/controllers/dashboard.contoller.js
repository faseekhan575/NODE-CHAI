import mongoose from "mongoose";
import ApiResponse from "../utils/Api_Respoonse";
import { ApiError } from "../utils/ApiErrors";
import { video } from "../models/video.models";
import { asynchandler } from "../utils/asynchandler";
import { likes } from "../models/likes.model";
import { subscription } from "../models/susbription";

const getallchannalstats = asynchandler(async (req, res) => {
    const userid=req.user._id
            

            const totalstats=await video.aggregate([
                {
                    $match:{
                        owner:new mongoose.Types.ObjectId(userid)
                    }
                },{
                    $lookup:{
                        from:"subscription",
                        localField:"owner",
                       foreignField:"channel",
                       as:"totalsubs",
                    }
                },{
                    $lookup:{
                        from:"likes",
                        localField:"owner",
                       foreignField:"video",
                       as:"totallikes",
                    }
                },{
                  $addFields:{
                        totalsubs:{$size:"$totalsubs"}
                    },
                },{
                    $addFields:{
                        totallikes:{$size:"$totallikes"}
                    },
                },{
                    $addFields:{
                        totalviews:{$sum: "$views"}
                    },
                },{
                    $addFields:{
                        totalvideos:{$sum: 1}
                    },
                }
            ,{
                    $project:{
                        _id:0,
                        totalviews:1,
                        totalsubs:1,
                        totallikes:1,
                        totalvideos:1
                    }
                }
            ])
            if (!totalstats){
                return res.status(404).json(new ApiError(404,"there was error in fetching data"))
            }
            else{
                 return res.status(200).json(new ApiResponse(200,totalstats,"all things fetched"))
            }
});

         const getallvideosuploded=asynchandler(async(req,res)=>{
            const user=req.user._id

            const getallvideos=await video.find({
                   owner:user
            })
            
        
          if (!getallvideos){
             return res.status(404).json(new ApiError(404,"no videos found"))
        }
        else{
             return res.status(200).json(new ApiResponse(200,getallvideos,"all videos fetched sucesfully"))
        }

     })   
        





export{
    getallchannalstats,
    getallvideosuploded
}