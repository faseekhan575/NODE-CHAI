import { ApiError } from "../utils/ApiErrors";
import { asynchandler } from "../utils/asynchandler";
import { JsonWebTokenError as jwt} from "jsonwebtoken";
import User from "../models/user.models";


const jwtSecret=asynchandler(async(req,res,next)=>{
  try {
     const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("bearer ","")

   if (!token){
    throw new ApiError(401,"unauthroized request")
   }
   
   const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN)

    const user= await User.findById(decodedToken?._id).select(
       "-password -tokens"
     )

     if (!user){
        throw new ApiError(401,"invalid acess token")
     } 
     req.user=user;
     next()
  } catch (error) {
    throw new ApiError(401,"unauthroized request")
  }


})

export default jwtSecret;