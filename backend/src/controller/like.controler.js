import mongoose from "mongoose";
import { Like } from "../models/like.mode.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._id

    if (!videoId) {
        throw new ApiError(400, "Invalid request to toggle video like")
    }

    const likeExist = await Like.findOne({
        video: videoId,
        likedBy: userId
    })

    // Unlike
    if (likeExist) {
        await Like.findByIdAndDelete(likeExist._id)

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Unlike successful"
                )
            )
    }

    // Like
    const like = await Like.create({
        video: videoId,
        likedBy: userId
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                like,
                "Video liked successfully"
            )
        )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user._id

    if (!commentId) {
        throw new ApiError(400, "Invalid request to toggle comment like")
    }

    const likeExist = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })

    // Unlike
    if (likeExist) {
        await Like.findByIdAndDelete(likeExist._id)

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Comment unlike successful"
                )
            )
    }

    // Like
    const like = await Like.create({
        comment: commentId,
        likedBy: userId
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                like,
                "Comment liked successfully"
            )
        )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user._id

    if (!tweetId) {
        throw new ApiError(400, "Invalid request to toggle tweet like")
    }

    const likeExist = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    })

    // Unlike
    if (likeExist) {
        await Like.findByIdAndDelete(likeExist._id)

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Tweet unlike successful"
                )
            )
    }

    // Like
    const like = await Like.create({
        tweet: tweetId,
        likedBy: userId
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                like,
                "Tweet liked successfully"
            )
        )
})

const getAllLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const videos = await Like.aggregate(
        [
            {
                $match: {
                    likedBy: new mongoose.Types.ObjectId(userId),
                    video: { $exists: true }

                }
            },

            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "video"
                }
            },
            {
                $addFields: {
                    video: {
                        $first: "$video"
                    }
                }
            }
        ]
    )

    if (!videos.length) throw new ApiError(404, 'liked video not found')

    return res.status(200).json(new ApiResponse(200, videos, "liked video fetched successfulyy"))
})

export {
    toggleVideoLike,
    getAllLikedVideos,
    toggleCommentLike,
    toggleTweetLike
}