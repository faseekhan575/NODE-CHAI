import { Router } from "express";

import { upload } from "../middlewares/multer.middelware";

import jwtSecret from "../middlewares/auth.middelware";
import { getsubcribedchannels, getuserchannalsubcribers, togglesubcription } from "../controllers/subcription.controllers";
import { getuserchannalprofile } from "../controllers/User.controllers";

const Routers = Router()



Routers.route("/toggle/:channalid").post(jwtSecret,togglesubcription)

Routers.route("/getchannalsubcribers/:channalid").get(getuserchannalsubcribers)

Routers.route("/getsubcribedchananl/:subscribeID").get(jwtSecret,getsubcribedchannels)

export default Routers