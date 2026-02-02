import { Router } from "express";
import registerUser from "../controllers/User.controllers.js"

//mine partice
import { createproduct } from "../controllers/User.controllers.js";

const Routers = Router();



Routers.route("/Register").post(registerUser)
//mine partice

Routers.route("/create").post(createproduct)


export default Routers