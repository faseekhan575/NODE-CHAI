// import { Router } from "express";

// import { upload } from "../middlewares/multer.middelware.js";

// import jwtSecret from "../middlewares/auth.middelware.js";
// import { deletevideo, getallvideos, getvideobyid, publishvideo, togglepublish, updatedetails } from "../controllers/video.contollers.js";


// const videoRouters = Router();


// videoRouters.route("/Publish").post(jwtSecret,
//      upload.fields([
//           { name: "videofile", maxCount: 1 },
//           { name: "thumbnail", maxCount: 1 },
//      ])
// ,publishvideo)

// videoRouters.route("/getallvideos").get(jwtSecret,getallvideos)

// videoRouters.route("/getvideobyid/:videoid").get(jwtSecret,getvideobyid)

// videoRouters.route("/updatevideo/:videoid").patch(
//     jwtSecret,
//     upload.fields([
//         { name: "thumbnail", maxCount: 1 }
//     ]),
//     updatedetails
// )

// videoRouters.route("/deletevideo/:videoid").delete(jwtSecret,deletevideo)

// videoRouters.route("/togglepublish/:videoid").post(jwtSecret,togglepublish)

//   export default videoRouters

import { Router } from "express";
import { upload, handleMulterError } from "../middlewares/multer.middelware.js";
import jwtSecret from "../middlewares/auth.middelware.js";
import {
  deletevideo,
  getallvideos,
  getvideobyid,
  publishvideo,
  togglepublish,
  updatedetails,
} from "../controllers/video.contollers.js";

const videoRouters = Router();

videoRouters.route("/Publish").post(
  jwtSecret,
  upload.fields([
    { name: "videofile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  handleMulterError,
  publishvideo
);

videoRouters.route("/getallvideos").get(jwtSecret, getallvideos);

videoRouters.route("/getvideobyid/:videoid").get(jwtSecret, getvideobyid);

videoRouters.route("/updatevideo/:videoid").patch(
  jwtSecret,
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  handleMulterError,
  updatedetails
);

videoRouters.route("/deletevideo/:videoid").delete(jwtSecret, deletevideo);

videoRouters.route("/togglepublish/:videoid").post(jwtSecret, togglepublish);

export default videoRouters;