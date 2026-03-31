import ApiResponse from "../utils/Api_Respoonse";
import { asynchandler } from "../utils/asynchandler";






   const healthcheck=asynchandler(async(req,res)=>{
            return res.status(200).json(new ApiResponse(200, null ,"all ok bro"))
   })

   export default healthcheck