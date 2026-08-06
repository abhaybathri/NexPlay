import { useEffect, useState } from "react";
import { api } from "../api/axios.js";
import VideoCard from "./Card/VideoCard.jsx";
export function ChannelVideo({userId}){
    const [videos, setvideos] = useState([])
        useEffect(()=>{
            async function getVideos(){
                try {
                    const response = await api.get(`/dashboard/get-videos/${userId}`)
                    setvideos(response.data.data)
                    
                } catch (error) {
                    console.log('error during fetching channel videos',error);
                    
    console.log("Response:", error.response);
    console.log("Data:", error.response?.data);
    console.log("Status:", error.response?.status);
                    
                }
            }
            getVideos()
        },[])
    return(
        <div className="grid grid-cols-3">
            {
                videos.map((video)=>(
                    <VideoCard 
                    key={video._id}
            videoId={video._id}
            thumbnail={video.thumbnail}
            avatar={video.owner.avatar}
            title={video.title}
            username={video.owner.username}
            views={video.views}
            createdAt={video.createdAt}
            duration={video.duration}
            />
                ))
            }
        </div>
    )
}