import { Router } from "express";
import registerUser, { get_watchedhistory, getcurrentuser, getuserchannalprofile, LoginUser, LogoutUser, resetpasswardss, updatecoverimage, Updateemailandnameandfullname, updateprofilepicture, } from "../controllers/User.controllers.js"
import { upload } from "../middlewares/multer.middelware.js";
import { generateRefreshToken } from "../controllers/User.controllers.js";

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

Routers.route("/Login").post(LoginUser)
Routers.route("/logout").post(jwtSecret,LogoutUser)
Routers.route("/refresh-token").post(generateRefreshToken)
Router.route("/change-passward").post(jwtSecret,resetpasswardss)
Router.route("/current-user").get(jwtSecret,getcurrentuser)
Router.route("/update-account").patch(jwtSecret,Updateemailandnameandfullname)
Router.route("/avatar").patch(jwtSecret,upload.single("/avatar"),updateprofilepicture)
Router.route("coverimage").patch(jwtSecret,upload.single("coverimage"),updatecoverimage)
Router.route("/c/:username").get(jwtSecret,getuserchannalprofile)
Router.route("/history").get(jwtSecret,get_watchedhistory)




//mine partice
Routers.route("/create").post(createproduct)


export default Routers