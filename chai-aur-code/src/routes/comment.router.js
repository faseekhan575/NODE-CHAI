import { Router} from "express";

import { upload } from "../middlewares/multer.middelware.js";

import jwtSecret from "../middlewares/auth.middelware.js";
import { addacomment, deleteacomment, getallvideocomments, updateacomment } from "../controllers/comment.controllers.js";

const commentRouters=Router()

commentRouters.use(jwtSecret)

commentRouters.route("/getallvideocomments/v/:videoId").get(getallvideocomments)

commentRouters.route("/addacomment/v/:videoId").post(addacomment)

commentRouters.route("/updatecomment/c/:commentId").patch(updateacomment)

commentRouters.route("/deletecomemnt/c/:commentId").delete(deleteacomment)

export default commentRouters