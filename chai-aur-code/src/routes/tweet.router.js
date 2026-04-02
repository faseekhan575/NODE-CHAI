import { Router } from "express";

import { upload } from "../middlewares/multer.middelware.js";

import jwtSecret from "../middlewares/auth.middelware.js";
import { createtweet, deletetweet, getusertweet, updatetweet } from "../controllers/tweet.contollers.js";


const tweetRouters = Router()

tweetRouters.route("/createtweet").post(jwtSecret,createtweet)

tweetRouters.route("/getusertweet").get(jwtSecret,getusertweet)

tweetRouters.route("/updatetweet/tweetid/:tweetid").patch(jwtSecret,updatetweet)

tweetRouters.route("/deletetweet/tweetid/:tweetid").delete(jwtSecret,deletetweet)

export default tweetRouters