import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"

// Attaches req.user if valid token present, but doesn't block if not
const optionalAuth = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken
        if (!accessToken) return next()
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded._id).select("-password -refreshToken")
        if (user) req.user = user
    } catch {
        // token invalid or expired — just proceed without user
    }
    next()
}

export default optionalAuth
