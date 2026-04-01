import { Router } from "express";

import { upload } from "../middlewares/multer.middelware";

import jwtSecret from "../middlewares/auth.middelware";
import { createtweet, deletetweet, getusertweet, updatetweet } from "../controllers/tweet.contollers";


const Routers = Router()

Routers.route("/createtweet").post(jwtSecret,createtweet)

Routers.route("/getusertweet").get(getusertweet)

Routers.route("/updatetweet/tweetid/:tweetid").patch(jwtSecret,updatetweet)

Routers.route("/deletetweet/tweetid/:tweetid").delete(jwtSecret,deletetweet)

export default Routers