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
import videoRouters from './routes/video.router.js';
import playlistRouters from './routes/playlist.router.js';
import likeRouters from './routes/like.router.js';
import commentRouters from './routes/comment.router.js';
import subRouters from './routes/subcription.router.js';
import tweetRouters from './routes/tweet.router.js';
import dashRouters from './routes/dashboard.router.js';
import hRouters from './routes/healthcheck.router.js';

app.use("/api/v1/user",Routers)

app.use("/api/v2/video",videoRouters)

app.use("/api/v3/playlist",playlistRouters)

app.use("/api/v4/comment",commentRouters)

app.use("/api/v5/tweet",tweetRouters)

app.use("/api/v6/like",likeRouters)

app.use("/api/v7/dashbaord",dashRouters)

app.use("/api/v8/heathcheck",hRouters)

app.use("/api/v9/subcription",subRouters)







export default app