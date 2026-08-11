import dotenv from 'dotenv'
import express, { urlencoded } from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'

dotenv.config({ path: './.env' })

const app = express()

app.use(cors({
    origin: (origin, callback) => {
        const allowed = (process.env.CORS_ORIGIN || "").split(",").map(o => o.trim())
        if (!origin || allowed.includes(origin) || allowed.includes("*")) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static("public"))

// Routes
import userRouter from './router/user.router.js'
import healthRouter from './router/healthcheck.router.js'
import tweetRouter from './router/tweet.router.js'
import subscriptionRouter from './router/subscription.router.js'
import videoRouter from './router/video.router.js'
import commentRouter from './router/comment.router.js'
import likeRouter from './router/like.router.js'
import PlaylistRouter from './router/playlist.router.js'
import dashboardRouter from './router/dashboard.router.js'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/healthcheck', healthRouter)
app.use('/api/v1/tweet', tweetRouter)
app.use('/api/v1/subscription', subscriptionRouter)
app.use('/api/v1/video', videoRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/like', likeRouter)
app.use('/api/v1/playlist', PlaylistRouter)
app.use('/api/v1/dashboard', dashboardRouter)

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    })
})

export default app
