import mongoose from "mongoose";
import ApiResponse from "../utils/Api_Respoonse";
import { ApiError } from "../utils/ApiErrors";
import { subscription } from "../models/susbription";
import { asynchandler } from "../utils/asynchandler";




const togglesubcription=asynchandler(async(req,res)=>{
         const {channalid}=req.params

         const user=req.user?._id

            const isSubscribed= await subscription.findOne({subscriber:user,channel:channalid})

        if (isSubscribed){
            await subscription.findByIdAndDelete(isSubscribed._id)
            return res.status(200).json({
                subscribe:false,
                message:"unsubcribed"
            })
        }
        else{
            await subscription.create({
                subscriber:user,channel:channalid
            }) 
            return res.status(200).json({
                subscribe:true,message:"subcribed"
            })
        
        }
       
})

const getuserchannalsubcribers=asynchandler(async(req,res)=>{
       const {channalid}=req.params

       

       const subcribers=await subscription.find(
        {
            channel:channalid,
            
        }
       ).select(
        "-channel"
       )
       if (subcribers.length===0){
        return res.status(404).json({
            message:"no user has been subcribed"
        })
       }
       else{
        return res.status(200).json(new ApiResponse(200,subcribers,"fetched all subcribers sucsfully"))
       }

})


const getsubcribedchannels=asynchandler(async(req,res)=>{
      const {subscribeID}=req.params

      const channel=await subscription.find({
        
subscriber:subscribeID

      }).select(
        "subscriber"
      )
         if(channel.length===0){
            return res.status(404).json({
            message:"no channal find"
        })
       }
       else{
        return res.status(200).json(new ApiResponse(200,channel,"fetched all subcribed channal"))
       }
})


export{
    togglesubcription,
    getsubcribedchannels,
    getuserchannalsubcribers
}

