import { asyncHandler } from "../utility/asyncHandler.js";
import { Video } from "../models/video.models.js";
import mongoose from "mongoose";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import uploadOnCloudinary from "../utility/uploadOnCloudinary.js";


const getAllVideos = asyncHandler(async (req,res)=>{
    const { page = 1, limit = 10, query, sortBy="createdAt", sortType="desc" } = req.query
    const userId= req.user?._id

    const pipeline = []

    // access only published videos
    pipeline.push(
        {
            $match:{
                isPublished: true
            }
        }
    )

    // search by title
    if(query){
        pipeline.push(
           {
            $match:{
                title:{
                    $regex:query,
                    $options: "i"
                
                }
            }
           }
        )
    } 

    // filter by user owner
     if(userId){
        if(!mongoose.Types.ObjectId.isValid(userId)) throw new ApiError(400,"Invalid user id")

        pipeline.push(
            {
                $match:{
                    owner: new mongoose.Types.ObjectId(userId)
                }
            }
        )
    }


    // sorting
    const allowSortingFields = [
        "createdAt","views","duration","title"
    ]

    const finalSorting = allowSortingFields.includes(sortBy) ? sortBy : "createdAt"
    pipeline.push(
        {
            $sort:{
                [finalSorting]: sortType === "asc" ? 1 : -1
            }
        }
    )

    

   

    const options = {
        page:Number(page),
        limit:Number(limit)

    }

    pipeline.push(
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                

            },
            
        },
        {
                $addFields:{
                    owner:{
                        $first:"$owner"
                    }
                }
     }
    )

    const videos = await Video.aggregatePaginate(
        Video.aggregate(pipeline),options
    )

if(videos.docs.length === 0) throw new ApiError(404,"videos not found or server not responds")

return res.status(200).json(new ApiResponse(200,videos,"video fetched successfully"))
    
})

const publishVideo = asyncHandler( async(req,res)=>{

    const {title, description, } = req.body

    if(!(title || description)) throw new ApiError(400,"all fields are required")

    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnailFile[0].path

    if(!videoLocalPath) throw new ApiError(400,"video file is required")
    if(!thumbnailLocalPath) throw new ApiError(400,"thumbnail file is required")

    const video = await uploadOnCloudinary(videoLocalPath)
    if(!video) throw new ApiError(500,"video file not upload on cloudinary")

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail) throw new ApiError(500,"thumbnail file not upload on cloudinary")

    const videoResponse = await Video.create({
        videoUrl: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: video.duration,
        owner: req.user._id
    })

    if(!videoResponse) throw new ApiError(500,'database not response for video published')
        console.log(videoResponse);
        

    return res.status(200).json(new ApiResponse(200,videoResponse,"files uploaded successfully"))
    


    


})

const deleteVideo = asyncHandler( async(req,res)=>{
    const {videoId} = req.params

    if(!videoId) throw new ApiError(400,"video not found")

    const response = await Video.findById(videoId)
    if(!response) throw new ApiError(404,"video not found in db")

    if(response.owner.toString() !== req.user._id.toString()) throw new ApiError(404,"you are not authorize to delete this video")

    await Video.findByIdAndDelete(videoId);


    return res.status(200).json(new ApiResponse(200,{},"video deleted successfully"))
})

const getVideoById = asyncHandler( async(req,res)=>{
    const {videoId} = req.params

    if(!videoId) throw new ApiError(400,"invalid video url")

    const video = await Video.findById(videoId)
    if(!video) throw new ApiError(404,"video not found in db")

    return res.status(200).json(new ApiResponse(200,video,"video fetched successfully"))
})

const updateVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {title,description,} = req.body



    if(!title) throw new ApiError(400,"title is required")
    if(!description) throw new ApiError(400,"description is required")
    
    const thumbnailLocalPath = req.file?.path
    if(!thumbnailLocalPath) throw new ApiError(400,"thumbnail is required")

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail) throw new ApiError(500,"thumbnail is not able to change")

        // delete thumbnail from cloudinary
        // authenticate user are owner of video or not


    const video = await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                title,
                description,
                thumbnail: thumbnail.url
            }
        },
        {
            new:true
        }
    )
    if(!video) throw new ApiError(404,"video not found in db")

    return res.status(200).json( new ApiResponse(200,video,"video updated successfully"))

})

const togglePublishStatus = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if(!videoId) throw new ApiError(400,"video not found")

    const response = await Video.findById(videoId)
    if(!response) throw new ApiError(404,'video not found')

    if(response.owner.toString() !== req.user._id.toString()) throw new ApiError(404,"you are not authorize to delete this video")
    response.isPublished = !response.isPublished
    await response.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200,{},"toggle successfull"))
})

export {
    getAllVideos,
    publishVideo,
    deleteVideo,
    updateVideo,
    getVideoById,
    togglePublishStatus
}
