import { ApiError } from "../utility/ApiError.js";
import {ApiResponse} from "../utility/ApiResponse.js"
import { asyncHandler } from "../utility/asyncHandler.js";
import {User} from '../models/user.models.js'
import uploadOnCloudinary from '../utility/uploadOnCloudinary.js'
import { pipeline } from "stream";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";

const generateTokens = async function(id){
    try {
        const user = await User.findById(id)
        if(!user) throw new ApiError(400,"invalid tokens")
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        console.log("tokens generate successfully");
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
    
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"tokens not generated from server")
    }
    
}

const createUser = asyncHandler(async function(req,res){
    const {username,email,fullname,password} = req.body
    
    
    if(
        [username,email,fullname,password].some((field)=> field.trim() === "")
    ){
        return new ApiError(404,"all fields are required")
    }

    const existUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existUser) throw new ApiError(401,"user already exist with this email or username")

    const avatarLocalPath = req.files?.avatar[0]?.path
    if(!avatarLocalPath) throw new ApiError(401,"cover image is necessary")
        
    const coverImageLocalPath = req.files.coverImage[0]?.path
    console.log("cover image local path is " , coverImageLocalPath);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log(avatar);
    

    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    

    if(!avatar) throw new ApiError(500,"something went wrong ::: avatar image not upload into server")

    const user = await User.create(
        {
            username,
            fullname,
            email,
            password,
            avatar:avatar.url,
            coverImage : coverImage.url || ""
        }
    )

    if(!user) throw new ApiError(500,'database not respond , user create failed')

    const createdUser = await User.findOne(user._id).select("-password -refreshToken")
console.log(createdUser);

    return res.status(200)
    .json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
    

   
})

const loggedInUser = asyncHandler( async function(req,res){
    const {username,email,password} = req.body

    if(!(username || email)) throw new ApiError(401,"email or password is required")
    if(!password) throw new ApiError(402, "password is required")

    const userExist = await User.findOne({
        $or:[{username},{email}]
    })

    if(!userExist) throw new ApiError(401, "user does not exist")

    const isPasswordCorrect = await userExist.isPasswordCorrect(password)

    if(!isPasswordCorrect) throw new ApiError(404,"invalid credentials")

    // generate tokens

    const {accessToken, refreshToken } = await generateTokens(userExist._id)

    const options = {
        secure:true,
        httpOnly:true
    }
    
    const loggedUser = await User.findById(userExist._id).select("-password -refreshToken")

    

    return res.status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(200,loggedUser,"user successfully logged in")
    )



    })

const loggedOutUser = asyncHandler( async function(req,res){
    const user = req.user
    if(!user) throw new ApiError(401,"user not find by verifyJwt in loggedout controller")

    await User.findByIdAndUpdate(
        user._id,
        {
            $unset:{
                refreshToken:1
            }
        }
    )
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(201,{},"user logged out successfully")
    )
})

const getCurrentUser = asyncHandler( async function(req,res){
    const user = req.user
    if(!user) throw new ApiError(401,"user not logged in")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"user fetched successfully")
    )
})

const updateProfile = asyncHandler( async function(req,res){
    const {fullname, email} = req.body
    
    if(!(fullname || email)) throw new ApiError(400,"any one field is necessary")

        const updateData = {}
    if(fullname !== undefined) updateData.fullname = fullname
    if(email !== undefined) updateData.email = email
    
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: updateData
        },
        {
            new:true
        }
    ).select("-password -refreshToken")

    if(!user) throw new ApiError(500,"database not respond")
     
    return res.status(200).json( new ApiResponse(200,user,"profile updated successfully"))
    
})

const updatePassword = asyncHandler( async function(req,res){
    const {oldPassword:oldpass, newPassword:newpass} = req.body
    if(!(oldpass && newpass)) throw new ApiError(401,"both fields are required to update password")

    const user = await User.findById(req.user._id)
    if(!user) throw new ApiError(404,"user not logged in")

    const correctPass =  user.isPasswordCorrect(oldpass);
    if(!correctPass) throw new ApiError(404,"password does not match with old password")

    user.password = newpass
    user.save({validateBeforeSave:false})
    
    return res.status(200).json( new ApiResponse(200,{},"password updated successfully"))

})

const updateAvatar = asyncHandler( async function(req,res){
    const user = req.user
    if(!user) throw new ApiError(401,"need to login to update avatar")
    
    const avatartLocalPath = req.file?.path
    if(!avatartLocalPath) throw new ApiError(401,'avatart file is required to update')

    const avatar = await uploadOnCloudinary(avatartLocalPath)
    if(!avatar) throw new ApiError(500,'server not response')

    const newUser = await User.findByIdAndUpdate(user._id,
        {
            avatar:avatar.url
        },
        {
            new:true
        }
    ).select("-refreshToken -password")
    newUser.save({validateBeforeSave:false})

    if(!newUser) throw new ApiError(500,"database not response")

    return res.status(200).json( new ApiResponse(200,newUser,"avatar updated successfully"))


})
const updateCoverImage = asyncHandler( async function(req,res){
     const user = req.user
    if(!user) throw new ApiError(401,"need to login to update avatar")
    
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath) throw new ApiError(401,'avatart file is required to update')

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage) throw new ApiError(500,'server not response')

    const newUser = await User.findByIdAndUpdate(user._id,
        {
            coverImage:coverImage.url
        },
        {
            new:true
        }
    ).select("-refreshToken -password")
    newUser.save({validateBeforeSave:false})

    if(!newUser) throw new ApiError(500,"database not response")

    return res.status(200).json( new ApiResponse(200,newUser,"avatar updated successfully"))


})

const getChannelProfile = (async(req,res)=>{
    const {username} = req.params

    if(!username) throw new ApiError(404,"channel not found")

    const channel = await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                subscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond: {
                        if:{ $in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                        }
                    }
                }
            
        },
        {
            $project:{
                username:1,
                fullname:1,
                subscribersCount:1,
                subscribedToCount:1,
                avatar:1,
                coverImage:1,
                email:1,
                isSubscribed:1,
                _id:1
            }
        }
    ])

    if(!channel.length) throw new ApiError(404,"channel not exist")
    return res.status(200)
    .json(
        new ApiResponse(200,channel[0],"channel fetched successfully")
    )
})

const getWatchHistory = asyncHandler( async(req,res)=>{
    // find current user
    // find video document on the basis of watch History video id's
    // in video document they have owner field so we again access owner details in user doc from video doc
    // after finding owner field return video doc with owner information and store in watchHistory so we have all videos

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }

        },
        {
            // access video document
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        // find each owner document on the basis of owner id
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                // takes only necessary details of owner
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        email:1,
                                        avatar:1
                                      
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                
                ]
            },

        }
   ] )

   return res.status(200).json( new ApiResponse(200,user[0].watchHistory,"Watch history fetched successfully"))

})

const refreshTokens = asyncHandler( async(req,res)=>{
    const incomingRefToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefToken) throw new ApiError(404,"unauthorize request token dont valid")

    const decodedToken = jwt.verify(incomingRefToken,process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken._id)
    if(!user) throw new ApiError(404,'invalide refresh Token')

    if(incomingRefToken !== user.refreshToken) throw new ApiError(400,'refrsh token is expire or used')

    const options={
        httpOnly:true,
        secure:true
    }
    const {accessToken, refreshToken} = await generateTokens(user._id)

    return res
            .status(200)
            .cookie("accessToken",accessToken, options)
            .cookie("refreshToken",refreshToken, options)
            .json(
                new ApiResponse(200,
                    {
                        accessToken,refreshToken
                    },
                    "Access token refresh successfully"
                )
            )
})

export {
    createUser,
    loggedInUser,
    loggedOutUser,
    getCurrentUser,
    updateProfile,
    updatePassword,
    updateAvatar,
    updateCoverImage,
    getChannelProfile,
    getWatchHistory,
    refreshTokens
    
}