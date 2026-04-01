import { Router } from "express";

import { upload } from "../middlewares/multer.middelware";

import jwtSecret from "../middlewares/auth.middelware";
import { deletevideo, getallvideos, getvideobyid, publishvideo, togglepublish, updatedetails } from "../controllers/video.contollers";


const Routers = Router();


Routers.route("/Publish").post(
     upload.fields([
          { name: "videofile", maxCount: 1 },
     ])
,publishvideo)

Routers.route("/getallvidoes").get(jwtSecret,getallvideos)

Routers.route("/getvideobyid/:id").get(jwtSecret,getvideobyid)

Routers.route("/updatevideo/:id").patch(jwtSecret,updatedetails)

Routers.route("/deletevideo/:id").delete(jwtSecret,deletevideo)

Routers.route("/togglepublish/:id").post(jwtSecret,togglepublish)

  export default Routers