import { Router } from "express";

import { upload } from "../middlewares/multer.middelware.js";

import jwtSecret from "../middlewares/auth.middelware.js";
import { getalllikedvideos, likeonvideo, togglecommentlike, toggletweettlike } from "../controllers/like.controller.js";


 const likeRouters=Router()


likeRouters.route("/likevideo/videoid/:videoid").patch(jwtSecret,likeonvideo)

likeRouters.route("/togglecomemnt/commentId/:commentId").patch(jwtSecret,togglecommentlike)

likeRouters.route("/toggletweetlike/tweetID/:tweetId").patch(jwtSecret,toggletweettlike)

likeRouters.route("/getalllikevideos").get(jwtSecret,getalllikedvideos)

export default likeRouters