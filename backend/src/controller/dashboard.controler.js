import mongoose, { mongo } from "mongoose";
import { Video } from "../models/video.models.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.mode.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";

const getChannelStatus = asyncHandler(async (req, res) => {
    const {userId} = req.params


    const totalVideosCount = await Video.countDocuments({
        owner: userId
    })

    const videos = await Video.find({
        owner: userId
    })

    let totalViewsCount = 0

    videos.forEach((video) => {
        totalViewsCount += video.views
    })

    const totalSubscribersCount = await Subscription.countDocuments({
        channel: userId
    })

    const likes = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: {
                    $sum: {
                        $size: "$likes"
                    }
                }
            }
        }
    ])

    const result = {
        totalVideosCount,
        totalViewsCount,
        totalSubscribersCount,
        totalLikeCount: likes[0]?.totalLikes || 0
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Channel status fetched successfully"
            )
        )
})

const getChannelVideo = asyncHandler(async (req,res)=>{

    const {userId} = req.params
    if(!userId) throw new ApiError(400,"invalid request")

    const videos = await Video.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },{
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            fullname:1,
                            username:1,
                            email:1,
                            avatar:1
                        }
                    },
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
    ])
    if(!videos.length) throw new ApiError(400,"videos not find for this channel")

    return res.status(200).json(new ApiResponse(200,videos,"video fetched successfully"))
})

export {
    getChannelStatus,
    getChannelVideo
}