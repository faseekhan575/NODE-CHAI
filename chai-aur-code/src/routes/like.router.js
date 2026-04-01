import { Router } from "express";

import { upload } from "../middlewares/multer.middelware";

import jwtSecret from "../middlewares/auth.middelware";
import { getalllikedvideos, likeonvideo, togglecommentlike, toggletweettlike } from "../controllers/like.controller";


 const Routers=Router()


 Routers.route("/likevideo/videoid/:videoid").patch(jwtSecret,likeonvideo)

 Routers.route("/togglecomemnt/commentId/:commentId").patch(jwtSecret,togglecommentlike)

 Routers.route("/toggletweetlike/tweetID/:tweetId").patch(jwtSecret,toggletweettlike)

 Routers.route("/getalllikevideos").get(jwtSecret,getalllikedvideos)

export default Routers