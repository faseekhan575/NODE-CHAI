import { Router, Router } from "express";

import { upload } from "../middlewares/multer.middelware";

import jwtSecret from "../middlewares/auth.middelware";
import { getallchannalstats, getallvideosuploded } from "../controllers/dashboard.contoller";


    const Routers=Router()


Routers.route("/getallchannelstats").get(jwtSecret,getallchannalstats)

Routers.route("/getallvideouplode").get(getallvideosuploded)

export default Routers