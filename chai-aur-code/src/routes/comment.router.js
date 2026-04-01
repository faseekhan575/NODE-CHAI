import { Router, Router } from "express";

import { upload } from "../middlewares/multer.middelware";

import jwtSecret from "../middlewares/auth.middelware";
import { addacomment, deleteacomment, getallvideocomments, updateacomment } from "../controllers/comment.controllers";

const Routers=Router()

Routers.use(jwtSecret)

Routers.route("/getallvideocomments/v/:videoId").get(getallvideocomments)

Routers.route("/addacomment/v/:videoId").post(addacomment)

Routers.route("/updatecomment/c/:commentId").patch(updateacomment)

Routers.route("/deletecomemnt/c/:commentId").delete(deleteacomment)

export default Routers