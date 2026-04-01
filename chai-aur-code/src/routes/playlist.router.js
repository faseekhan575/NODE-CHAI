import { Router } from "express";

import { upload } from "../middlewares/multer.middelware";

import jwtSecret from "../middlewares/auth.middelware";
import { addvideostoplaylist, createplaylist, deletePlaylist, getplaylistbyid, getuserplaylist, removevideofromplaylist, updatePlaylist } from "../controllers/playlist.controllers";



 const Routers=Router()


 Routers.route("/createplaylist").post(jwtSecret,createplaylist)

 Routers.route("/getuserplay/:userid").get(jwtSecret,getuserplaylist)

  Routers.route("/getplaylistbyid/:playlistbyid").get(jwtSecret,getplaylistbyid)

   Routers.route("/addvideotoplaylist/video/:videoId/palylist/:playlistId").post(jwtSecret,addvideostoplaylist)

 Routers.route("/removevideofromplaylist/video/:videoId/palylist/:playlistId").patch(jwtSecret,removevideofromplaylist)

  Routers.route("/deleteplaylist/:playlistId").delete(jwtSecret,deletePlaylist)

   Routers.route("/updateplaylist/:playlistId").patch(jwtSecret,updatePlaylist)

export default Routers

