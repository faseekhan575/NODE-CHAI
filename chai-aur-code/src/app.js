import express from 'express';
import cros from 'cors'
import cookieParser from 'cookie-parser'


const app = express();

app.use(cros({
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


//mine partice
app.use("/api/v2/product",Routers)




export default app