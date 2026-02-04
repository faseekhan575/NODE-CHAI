import { Router } from "express";
import registerUser from "../controllers/User.controllers.js"
import { upload } from "../middlewares/multer.middelware.js";

//mine partice
import { createproduct } from "../controllers/User.controllers.js";

const Routers = Router();



Routers.route("/Register").post(
     upload.fields([
        {
            name:"avatar",
            maxCount:1
        }
        ,{
            name:"coverimage",
            maxCount:1
        }
     ])
    
    
    ,registerUser)




//mine partice
Routers.route("/create").post(createproduct)


export default Routers