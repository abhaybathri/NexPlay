import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";

const postComment = asyncHandler(async (req,res)=>{
    const {content} = req.body
    const userId = req.user._id
    const {videoId} = req.params

    if(!content?.trim()) throw new ApiError(400,"comment is required")
    if(!videoId) throw new ApiError(404,"invalid video url")

    const comment = await Comment.create(
        {
            content,
            video: videoId,
            owner : userId
        }
    )

    if(!comment) throw new ApiError(404,"invalid request comment not added")

    return res.status(200).json(new ApiResponse(200,comment,"comment added successfully"))
})

const getVideoComment = asyncHandler(async (req,res)=>{
        const {videoId} = req.params
        const {page=1,limit=10, } = req.query



        const options = {
            page:Number(page),
            limit:Number(limit)
        }

        const comments = await Comment.aggregatePaginate(
            Comment.aggregate(
                [
                    {
                        $match:{
                            video: new mongoose.Types.ObjectId(videoId)
                        }
                    },
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner"
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
            ),
            options
        )

        if(!comments) throw new ApiError(401,"comments not foundt")
        
        return res.status(200).json(new ApiResponse(200,comments,"comments fetched successfully"))
    })

const updateComment = asyncHandler(async (req,res)=>{
    const {newComment} = req.body
    const {commentId} = req.params
    const userId = req.user._id

    if(!newComment) throw new ApiError(400,"invalid comment url")

    const comment = await Comment.findById(commentId)

if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }

    comment.content = newComment
    const newResComment = await comment.save({validateBeforeSave:false})

    return res.status(200).json(new ApiResponse(200,newResComment,"comment updated successfully"))


})

const deleteComment = asyncHandler(async (req,res)=>{
    const {commentId} = req.params
    const userId = req.user?._id

    if(!commentId) throw new ApiError(400,"invalid video url")

    const comment = await Comment.findById(commentId)

if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }

    await Comment.findByIdAndDelete(commentId)


    return res.status(200).json(new ApiResponse(200,{},"comment deleted successfully"))
})

export {
    postComment,
    getVideoComment,
    updateComment,
    deleteComment

}