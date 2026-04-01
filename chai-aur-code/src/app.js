import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express();

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "100kb"
}))

app.use(cookieParser())

app.use(express.urlencoded({
    extended: true,
    limit: "100kb"
}))
app.use(express.static("public"))


//import routers
import Routers from './routes/user.router.js';

app.use("/api/v1/user",Routers)

app.use("/api/v2/Video",Routers)

app.use("/api/v3/playlist",Routers)




export default app