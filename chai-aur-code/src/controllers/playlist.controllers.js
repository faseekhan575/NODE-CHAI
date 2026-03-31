import mongoose from "mongoose";
import ApiResponse from "../utils/Api_Respoonse";
import { ApiError } from "../utils/ApiErrors";
import { playlists } from "../models/playlist.models";
import { asynchandler } from "../utils/asynchandler";


  const createplaylist=asynchandler(async(req,res)=>{
       const {name, description} =req.body
       const user=req.user._id

       if (!(name && description)){
        return res.status(404).json(new ApiError("plz first enter the name and desription"))
       }
       else{
        const createplaylits=await  playlists.create({
            name:name,
            owner:user,
             description:description,
        })

        if (!createplaylits){
            return res.status(404).json(new ApiError(404,"playlist not created plz try again"))
        }
        else{
             return res.status(200).json(new ApiResponse(200,createplaylits,"playlist created sucesfully enjoy"))
        }

       }
  })

  const getuserplaylist=asynchandler(async(req,res)=>{
    const {userid}=req.params

    const getuserplaylist=await playlists.find({
        owner:userid
    }).select(
        "-owner"
    )
    if (getuserplaylist.length===0){
         return res.status(404).json(new ApiError(404,"playlist not found"))
    }
    else{
         return res.status(200).json(new ApiResponse(200,getuserplaylist,"playlist fetched out sucesfully"))
    }
  })


  const getplaylistbyid=asynchandler(async(req,res)=>{
    const {playlistbyid}=req.params

    const playlistbyids= await playlists.findById(playlistbyid).select(
        "-owner"
    )
     if (!playlistbyids){
         return res.status(404).json(new ApiError(404,"playlist not found"))
    }
    else{
         return res.status(200).json(new ApiResponse(200,playlistbyids,"playlist fetched out sucesfully"))
    }
  })


  const addvideostoplaylist=asynchandler(async(req,res)=>{
       const {playlistId, videoId} = req.params

        const addvideos=await playlists.findByIdAndUpdate(
            playlistId ,{
            $push:{
                videos:videoId
            }
        },
        {new:true}
  )

        if (!addvideos){
             return res.status(404).json(new ApiError(404,"plz uplode video first"))
        }
        else{
             return res.status(200).json(new ApiResponse(200,addvideos,"video added to playlist sucesfully"))
        }
       })

  const removevideofromplaylist=asynchandler(async(req,res)=>{
        const {playlistId, videoId} = req.params

        const videodelete=await playlists.findByIdAndUpdate(
            playlistId,{
                $pull:{
                    videos:videoId
                },
            },{
                    new:true
                }
        )
        if (!videodelete){
             return res.status(404).json(new ApiError(404,"theres an issue while removing the video")) 
        }
        else{
            return res.status(200).json(new ApiResponse(200, videodelete,"video has been removed"))
           
        }

  })


  const deletePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
   
     const videodelete=await playlists.findByIdAndDelete(
        playlistId
     )
     if (!videodelete){
             return res.status(404).json(new ApiError(404,"theres an issue while removing the video")) 
        }
        else{
            return res.status(200).json(new ApiResponse(200, videodelete,"video has been removed"))
           
        }
    
})

  const updatePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!(name || description)) {
      return res
        .status(400)
        .json(new ApiError(400, "plz enter name or description first"))
    }

    const updates = {}
    if (name) updates.name = name
    if (description) updates.description = description

    const updatedPlaylist = await playlists.findByIdAndUpdate(
      playlistId,
      { $set: updates },
      { new: true }
    )

    if (!updatedPlaylist) {
      return res.status(404).json(new ApiError(404, "playlist not found"))
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedPlaylist, "playlist updated sucessfully")
      )
  })


export{
    createplaylist,
    updatePlaylist,
    deletePlaylist,
    removevideofromplaylist,
    addvideostoplaylist,
    getuserplaylist,
    getplaylistbyid
}