import { Router } from "express";
import registerUser, { LoginUser, LogoutUser } from "../controllers/User.controllers.js"
import { upload } from "../middlewares/multer.middelware.js";

//mine partice
import { createproduct } from "../controllers/User.controllers.js";
import jwtSecret from "../middlewares/auth.middelware.js";

const Routers = Router();



Routers.route("/Register").post(
   upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImages", maxCount: 1 } // plural
])
    
    
    ,registerUser)

Router.route("/Login").post(LoginUser)

Router.route("logout").post(jwtSecret,LogoutUser)




//mine partice
Routers.route("/create").post(createproduct)


export default Routers