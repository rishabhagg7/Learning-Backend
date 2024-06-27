import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use() for middlewares
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public")) //store file,folder,images on our server
app.use(cookieParser())

// routes
import userRouter from './routes/user.routes.js'
import videoRouter from "./routes/video.routes.js"

// routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)

//http://localhost:8000/api/v1/users/register 

export {app}