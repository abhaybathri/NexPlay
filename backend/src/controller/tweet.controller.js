import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";

const createTweet = asyncHandler(async (req,res)=>{
    const {content} = req.body

    if(!content) throw new ApiError(400,"content is required")

    const user = req.user

    const tweet = await Tweet.create({
        content:content.trim(),
        owner:user._id
    })

    if(!tweet) throw new ApiError(500,"tweet not created ::: database not respond")

    return res.status(200).json(new ApiResponse(200,tweet,"tweet created successfully"))
})

const updateTweet = asyncHandler(async (req,res)=>{
    const {newContent} = req.body
    if(!newContent?.trim()) throw new ApiError(400,"content is required for update tweet")
    const {tweetId} = req.params

    const updatedTweet = await Tweet.findOneAndUpdate(
        {
            _id:tweetId,
            owner:req.user._id
        },{
            $set:{
                content:newContent.trim()
            }
        },
        {
            new:true
        }
    )

    if(!updatedTweet) throw new ApiError(500,"tweet not updated ::: database not responds")

    return res.status(200).json(new ApiResponse(200,updatedTweet,"tweet updated successfully"))

})

const deleteTweet = asyncHandler(async (req,res)=>{
    const {tweetId} = req.params

    const deleteTweet = await Tweet.findOneAndDelete({
        _id: tweetId,
        owner: req.user._id
    })

    if(!deleteTweet) throw new ApiError(404,'tweet not found ::: databasee not responds or you are not owner')


    return res.status(200).json(new ApiResponse(200,deleteTweet,"tweet deleted successfully"))

})

const getUserserTweets = asyncHandler( async (req,res)=>{
    const user = req.user
    const userTweets = await Tweet.find({
        owner: req.user._id
    })
    if(!userTweets) throw new ApiError(404,"tweets not found")

    return res.status(200).json(new ApiResponse(200,userTweets),"tweets fetched successfully")

})
export {
    createTweet,
    updateTweet,
    deleteTweet,
    getUserserTweets
}