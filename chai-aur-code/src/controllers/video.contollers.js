import uplodeImage from "../models/cloudniary";
import { Video } from "../models/video.models";
import ApiResponse from "../utils/Api_Respoonse";
import { ApiError } from "../utils/ApiErrors";
import { asynchandler } from "../utils/asynchandler";


       const getallvideos=asynchandler(async(req,res)=>{
        const { page = 1, limit = 10, query, sortBy="createdAt", sortType="desc", userId } = req.query

        const pageNumber = parseInt(page);
        const pagelimit=parseInt(limit);
        const sortorder=sortType === "asc" ? 1: -1
    
        const videos=await Video.aggregate([
            {
                $match:{
                    ... (userId && {
                      owner: userId
                    }),
                    ... (query && {
                        title:{$regex:query,$options:"i"}
                    })
                }
            },{
                $sort:{
                    [sortBy]:sortorder
                }

            },{
                  $skip: ( pageNumber-1)*pagelimit
            },{
                $limit:pagelimit
            }
        ])

            if (videos.length===0){
                  return res.status(200).json(new ApiResponse(200,"no videos founded"))
       }
       else{
         return res.status(200).json(new ApiResponse(200,videos,"all videos finded"))
       } 
       })

       const publishvideo=asynchandler(async(req,res)=>{
             const user=req.user._id
              const { title, description} = req.body

              if (!(title && description)){
                 return res.status(400).json(new ApiError(400,"plz enter required feilds"))
              }

              const videofiles=req.files?.videofile?.[0]?.path
              const thumbnailfiles=req.files?.thumbnail?.[0]?.path

              if (!(videofiles && thumbnailfiles)){
                 return res.status(400).json(new ApiError(400,"plz uplode video first"))
              }

              const videuplode=await uplodeImage(videofiles)
                const thumbnailuplode=await uplodeImage(thumbnailfiles)

              if (!(videuplode &&thumbnailuplode)){
                 return res.status(400).json(new ApiError(400,"failed to uplode video on cloudninary plz uplode video again"))
              }

              const publish= await Video.create({
                     owner:user,
                     title:title,
                     description:description,
                     videofile:videuplode.url,
                     thumbnail:thumbnailuplode.url,
                     duration: videuplode.duration

              })

              if (!publish){
    return res.status(400).json(new ApiError(400,"error while publishing a video"))
       }
       else{
         return res.status(200).json(new ApiResponse(200,publish,"videouploded"))
       } 


       })

       const getvideobyid=asynchandler(async(req,res)=>{
          const {videoid}=req.params

          const getvideo=await Video.findById(
            videoid
          )

           if (!getvideo){
    return res.status(400).json(new ApiError(400,"error while getting a video"))
       }
       else{
         return res.status(200).json(new ApiResponse(200,getvideo,"video fetched"))
       } 

          
       })

       const updatedetails=asynchandler(async(req,res)=>{
         //TODO: update video details like title, description, thumbnail
         const {videoid}=req.params
         const {title , description}=req.body
         

         if (!(title && description)){
             return res.status(400).json(new ApiError(400,"plz enter required feilds"))
         }
         const thumnailfile=req.files?.thumbnail?.[0]?.path

           if (!thumnailfile){
                 return res.status(400).json(new ApiError(400,"plz uplode video first"))
              }
             
              const cloudnarythamial=await uplodeImage(thumnailfile)

              
              if (!cloudnarythamial){
                 return res.status(400).json(new ApiError(400,"failed to uplode video on cloudninary plz uplode video again"))
              }

              const updating=await Video.findByIdAndUpdate(
                videoid,{
                    $set:{
                        title:title,
                        description:description,
                        thumbnail:cloudnarythamial.url,
                    }
                },{
                    new:true
                }
              )
              
              if (!updating){
    return res.status(400).json(new ApiResponse(400,"error while updating details try again"))
       }
       else{
         return res.status(200).json(new ApiResponse(200,updating,"deatils updated"))
       } 
       })

       const deletevideo=asynchandler(async(req,res)=>{
        const {videoid}=req.params

        const deletevideo=await Video.findByIdAndDelete(
            videoid
        )

        if (!deletevideo){  
    return res.status(400).json(new ApiError(400,"error while deleting a video"))
       }
       else{
         return res.status(200).json(new ApiResponse(200,deletevideo,"video deleted"))
       }        
        })

    const togglepublish=asynchandler(async(req,res)=>{
        const {videoid}=req.params

        const videouplode=await Video.findById(
            videoid
        )

        if (videouplode){
            const videoresponse=  await Video.findByIdAndUpdate(
                videouplode._id,{
                    $set:{
                        isPublished: !videouplode.isPublished 
                    }},{
                        new:true
                    }
              )
             if (videoresponse){
                return res.status(200).json(new ApiResponse(200,videoresponse,"video has been publised"))
             }
              else{
            return res.status(400).json(new ApiError(400,"error while video has been publised"))
        }
        }
        else{
            return res.status(400).json(new ApiError(400,"video not found"))
        }
       
        })

   export{
    getallvideos,
    publishvideo,
    getvideobyid,
    updatedetails,
    deletevideo,
    togglepublish
   }