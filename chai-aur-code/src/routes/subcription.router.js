import { Router } from "express";

import { upload } from "../middlewares/multer.middelware.js";

import jwtSecret from "../middlewares/auth.middelware.js";
import { getsubcribedchannels, getuserchannalsubcribers, togglesubcription } from "../controllers/subcription.controllers.js";


const subRouters = Router()



subRouters.route("/toggle/:channalid").post(jwtSecret,togglesubcription)

subRouters.route("/getchannalsubcribers/:channalid").get(getuserchannalsubcribers)

subRouters.route("/getsubcribedchananl/:subscribeID").get(jwtSecret,getsubcribedchannels)

export default subRouters