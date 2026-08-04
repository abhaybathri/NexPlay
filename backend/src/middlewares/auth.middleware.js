import { User } from "../models/user.models.js";
import { ApiError } from "../utility/ApiError.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import jwt from "jsonwebtoken";


const verifyJwt = asyncHandler(async (req,res,next)=>{
    try {
        
        const accessToken = req.cookies.accessToken
        if(!accessToken) throw new ApiError(404,'user not logged in')
        
        const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken) throw new ApiError(402,'invalid tokens')
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user) throw new ApiError(500, "user not found based on tokens")
    
        req.user = user
    
        next();
    } catch (error) {
        console.log(("error occure during verify jwt middlware"),error);
        next(error);
        
    }
})

export default verifyJwt