import uplodeImage from "../models/cloudniary.js";
import { Video } from "../models/video.models.js";
import ApiResponse from "../utils/Api_Respoonse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asynchandler } from "../utils/asynchandler.js";


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

     const publishvideo = asynchandler(async (req, res) => {
    try {
        // Get authenticated user ID
        const user = req.user?._id;
        if (!user) {
            return res.status(401).json(new ApiError(401, "Unauthorized: user not found"));
        }

        // Destructure request body
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json(new ApiError(400, "Please enter all required fields"));
        }

        // Get uploaded files
        const videofiles = req.files?.videofile?.[0]?.path;
        const thumbnailfiles = req.files?.thumbnail?.[0]?.path;

        if (!videofiles || !thumbnailfiles) {
            return res.status(400).json(new ApiError(400, "Please upload both video and thumbnail files"));
        }

        // Upload files to Cloudinary
        const videuplode = await uplodeImage(videofiles);
        const thumbnailuplode = await uplodeImage(thumbnailfiles);

        if (!videuplode || !thumbnailuplode) {
            return res.status(500).json(new ApiError(500, "Failed to upload files to Cloudinary. Please try again"));
        }

        // Create video record in database
        const publish = await Video.create({
            owner: user,
            title: title,
            description: description,
            videofile: videuplode.url,
            thumbnail: thumbnailuplode.url,
            duration: videuplode.duration
        });

        if (!publish) {
            return res.status(500).json(new ApiError(500, "Error while publishing the video"));
        }

        // Success response
        return res.status(200).json(new ApiResponse(200, publish, "Video uploaded successfully"));

    } catch (error) {
        // Catch-all error handler
        return res.status(500).json(new ApiError(500, "Server error", error.message));
    }
});

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