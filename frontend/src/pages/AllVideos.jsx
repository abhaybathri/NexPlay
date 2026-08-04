import { useEffect, useState } from "react"
import { api } from "../api/axios.js"
import { VideoCard } from "../components/index.js"

export function AllVideos(){
    const [videos,setVideos]=useState([])
    
    useEffect(()=>{
        async function getVideos(){
            try {
                const response = await api.get("/video/")
                console.log(response.data.data.docs);
                setVideos(response.data.data.docs)
            } catch (error) {
                console.log(error);
                
            }
        }
        getVideos()
    },[])
    
    return(
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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