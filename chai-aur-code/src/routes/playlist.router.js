import { Router } from "express";

import { upload } from "../middlewares/multer.middelware.js";

import jwtSecret from "../middlewares/auth.middelware.js";
import { addvideostoplaylist, createplaylist, deletePlaylist, getplaylistbyid, getuserplaylist, removevideofromplaylist, updatePlaylist } from "../controllers/playlist.controllers.js";



 const playlistRouters=Router()


 playlistRouters.route("/createplaylist").post(jwtSecret,createplaylist)

 playlistRouters.route("/getuserplay/:userid").get(jwtSecret,getuserplaylist)

playlistRouters.route("/getplaylistbyid/:playlistbyid").get(jwtSecret,getplaylistbyid)

playlistRouters.route("/addvideotoplaylist/video/:videoId/palylist/:playlistId").post(jwtSecret,addvideostoplaylist)

playlistRouters.route("/removevideofromplaylist/video/:videoId/palylist/:playlistId").patch(jwtSecret,removevideofromplaylist)

playlistRouters.route("/deleteplaylist/:playlistId").delete(jwtSecret,deletePlaylist)

playlistRouters.route("/updateplaylist/:playlistId").patch(jwtSecret,updatePlaylist)

export default playlistRouters

