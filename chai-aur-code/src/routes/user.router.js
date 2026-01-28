import { Router } from "express";
import registerUser from "../controllers/User.controllers.js"
import express from "express";

const Routers=express()


Routers.route("/Register").post(registerUser)


export default Routers