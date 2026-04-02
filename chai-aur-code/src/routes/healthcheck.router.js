import { Router } from "express";

import { upload } from "../middlewares/multer.middelware.js";

import jwtSecret from "../middlewares/auth.middelware.js";
import healthcheck from "../controllers/healthcheck.controllers.js";




 const hRouters=Router()

 hRouters.route("/heathcheck").get(healthcheck)

 export default hRouters
