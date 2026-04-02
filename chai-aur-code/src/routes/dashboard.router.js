import { Router} from "express";

import { upload } from "../middlewares/multer.middelware.js";

import jwtSecret from "../middlewares/auth.middelware.js";
import { getallchannalstats, getallvideosuploded } from "../controllers/dashboard.contoller.js";


    const dashRouters=Router()


dashRouters.route("/getallchannelstats").get(jwtSecret,getallchannalstats)

dashRouters.route("/getallvideouplode").get(jwtSecret,getallvideosuploded)

export default dashRouters