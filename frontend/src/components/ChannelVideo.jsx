import { useEffect, useState } from "react"
import { api } from "../api/axios.js"
import VideoCard from "./Card/VideoCard.jsx"
import { VideoOff } from "lucide-react"

export function ChannelVideo({ userId }) {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return
        api.get(`/dashboard/get-videos/${userId}`)
            .then(res => setVideos(res.data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [userId])

    if (loading) {
        return (
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-video rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                        <div className="mt-2 h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                ))}
            </div>
        )
    }

    if (videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <VideoOff size={40} className="mb-3 opacity-30" />
                <p>No videos uploaded yet</p>
            </div>
        )
    }

    return (
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
            {videos.map(video => (
                <VideoCard
                    key={video._id}
                    videoId={video._id}
                    thumbnail={video.thumbnail}
                    avatar={video.owner?.avatar}
                    title={video.title}
                    username={video.owner?.username}
                    views={video.views}
                    createdAt={video.createdAt}
                    duration={video.duration}
                />
            ))}
        </div>
    )
}
