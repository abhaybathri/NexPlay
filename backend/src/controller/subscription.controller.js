import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";

const getUserChannelSubsribers = asyncHandler(async (req, res)=>{
    const {channelId} = req.params
    if(!channelId) throw new ApiError(404,'invalid channel name')

    const subscribers = await Subscription.find(
        {
            channel:channelId
        }
    )
    .populate("subscriber","username fullname avatar ")
    .select("-channel")

    if(!subscribers.length) throw new ApiError(404,'subscribers not found')

    return res.status(200).json(
        new ApiResponse(200,subscribers,"subscribers fetched successfully")
    )
})

const getSubscribedChannels = asyncHandler(async (req,res)=>{
    const subcribersId = req.user._id

    const subscribedChannels = await Subscription.find({
        subscriber: subcribersId
    })
    .populate("channel","fullname username avatar")
    .select("-subscriber")

    if(!subscribedChannels.length) throw new ApiError(404,'subscribed channels not found')

    return res.status(200).json(new ApiResponse(200,subscribedChannels,"channels fetched successfully"))
})

const toggleSubscriptions = asyncHandler(async (req,res)=>{
    const {channelId} = req.params
    const userId = req.user._id

    const subscribe = await Subscription.findOne(
        {
            channel:channelId,
            subscriber:userId
        }
    )
    if(subscribe){
        await Subscription.findOneAndDelete(
            {
                channel:channelId,
            subscriber:userId
            }
        )

        return res.status(200).json(new ApiResponse(200,{},"channel unsubsribed"))
    }

    const subscribeChannel = await Subscription.create({
        channel:channelId,
        subscriber:userId
    })

    if(!subscribeChannel) throw new ApiError(500,"channel not able to subscribed")
    
    return res.status(200).json(new ApiResponse(200,subscribeChannel,"channel subsribed"))


})


export {
    getUserChannelSubsribers,
    getSubscribedChannels,
    toggleSubscriptions

}