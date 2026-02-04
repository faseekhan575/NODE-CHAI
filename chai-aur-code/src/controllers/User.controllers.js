import { asynchandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import uplodeImage from "../models/cloudniary.js";
import {User} from "../models/user.models.js"
import ApiResponse from "../utils/Api_Respoonse.js";

const registerUser = asynchandler(async (req, res) => {
    const { username, fullname, email } = req.body
    
    if (!username || !fullname || !email) {
        res.status(201).json({
            message: "plz firts enter data to continue"
        })
    }
    else {
        res.status.json({
            message: "username fullname and email added sucesfully plz continue"
        })
    }

    const findinguser = await User.findOne({
        $or: [{ username }, { email }]
    });
  
     if (findinguser){
       throw new ApiError(409, "User with this email already exists")
     }
     const avatarPath = req.files?.avatar?.[0]?.path;
     const coverPath = req.files?.coverimage?.[0]?.path;


      if (!avatarPath || !coverPath){
        throw new ApiError(400,"plz first uplode avatar file")
      }

      const avatar=uplodeImage(avatarPath)
      const coverIamges=uplodeImage(coverPath)
            
      
         if (!avatar || !coverIamges){
        throw new ApiError(400,"plz first uplode avatar file")
      }

     const users= await User.create({
        fullname,
        avatar:avatar.url,
        coverimages:coverIamges.url,
        email,
        password,
       username, 
      })

      const createuser= await User.findById(User._id).select(
        "-passward -tokens"
      )

         if (!createuser){
            throw new ApiError(500,"there is error while svaing user plz try again clam!!!")
         }

         res.status(201).json({
               message: new ApiResponse(201,createuser,"user created sucessfully")
         })




})

///mine partice
export const createproduct = asynchandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({
            message: "missing plz add name to create product "
        })
    }
    else {
        res.status(201).json({
            message: "product created sucessfully"
        })
    }


})


//video 14 work


export default registerUser;


