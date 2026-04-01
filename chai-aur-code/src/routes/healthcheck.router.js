import { Router } from "express";

import { upload } from "../middlewares/multer.middelware";

import jwtSecret from "../middlewares/auth.middelware";
import healthcheck from "../controllers/healthcheck.controllers";




 const Routers=Router()

 Routers.route("/heathcheck").get(healthcheck)

 export default Routers
 