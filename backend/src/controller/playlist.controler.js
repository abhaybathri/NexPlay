import { ApiError } from "../utility/ApiError.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import {Playlist} from '../models/playlist.model.js'
import { ApiResponse } from "../utility/ApiResponse.js";
import uploadOnCloudinary from "../utility/uploadOnCloudinary.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async(req,res)=>{
    const {name,description} = req.body
    const user = req.user
    if(!name || !description) throw new ApiError(400,"name and description fields are required")
    
    const existPlaylist = await Playlist.findOne({
        name,
        owner:user._id
    })
    if(existPlaylist) throw new ApiError(402,'playlist with this name is already exist')

    const playlist = await Playlist.create(
        {
            name,
            description,
            owner: user._id
        }
    )
    if(!playlist) throw new ApiError(400,"playlist not created db not responds")

    return res.status(200).json(new ApiResponse(200,playlist,"playlist created successfully"))
})

const getUsersPlaylists = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const playLists = await Playlist.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"videos",
                foreignField:"_id",
                as:"videos",
                pipeline:[
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
    ])

    if(!playLists.length) throw new ApiError(404,"playlist not found")

        return res.status(200).json(new ApiResponse(200,playLists,"playlist of user fetched successfully"))
})

const getPlaylistById = asyncHandler(async(req,res)=>{
    const {playlistId }= req.params
    const playLists = await Playlist.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"videos",
                foreignField:"_id",
                as:"videos",
                pipeline:[
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
    ])

    if(!playLists.length) throw new ApiError(404,"playlist not found")

        return res.status(200).json(new ApiResponse(200,playLists,"Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoid, playlistid } = req.params

    if (!playlistid || !videoid) {
        throw new ApiError(400, "Invalid ID for playlist or video")
    }

    const playlist = await Playlist.findById(playlistid)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.videos.includes(videoid)) {
        throw new ApiError(400, "Video already exists in your playlist")
    }

    playlist.videos.push(videoid)

    const newPlaylist= await playlist.save()

    return res
        .status(200)
        .json(new ApiResponse(200, newPlaylist, "Video added successfully to playlist"))
})

const removeVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Invalid ID for playlist or video")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video doesn't exist in this playlist")
    }

    playlist.videos.pull(videoId)

    await playlist.save()

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video added successfully to playlist"))
})

const deletePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params
    if(!playlistId) throw new ApiError(400,"invalid playlist id ")

    const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user._id
})

    return res.status(200).json(new ApiResponse(200,playlist,"playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params
    const{name,description} = req.body

    if(!name || !description) throw new ApiError(400,"both name and description is required")

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            name,
            description
        },
        {
            new:true
        }
    )
    if(!playlist) throw new ApiError(404,"playlist not found in db")

    return res.status(200).json(new ApiResponse(200,playlist,"playlist updated successfully"))
})

export {
    createPlaylist,
    getUsersPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoToPlaylist,
    deletePlaylist,
    updatePlaylist
}