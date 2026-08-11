import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { api } from "../api/axios.js"
import { VideoCard } from "../components/index.js"
import { Heart } from "lucide-react"

export function LikedVideos() {
    const authStatus = useSelector(state => state.auth.status)
    const navigate = useNavigate()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setAuthChecked(true), 600)
        return () => clearTimeout(t)
    }, [])

    useEffect(() => {
        if (!authChecked) return
        if (!authStatus) { navigate("/signin"); return }
        api.get("/like/videos")
            .then(({ data }) => setVideos(data.data || []))
            .catch(() => setVideos([]))
            .finally(() => setLoading(false))
    }, [authChecked, authStatus, navigate])

    if (!authChecked || (authChecked && authStatus && loading)) {
        return (
            <div className="flex justify-center py-24">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-500 dark:border-zinc-700" />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="mb-6 flex items-center gap-3">
                <Heart size={22} className="text-red-500" />
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Liked Videos</h1>
            </div>
            {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-zinc-400 gap-2">
                    <Heart size={48} className="opacity-30" />
                    <p className="text-lg">No liked videos yet</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {videos.map(item => {
                        const video = item.video
                        if (!video) return null
                        return (
                            <VideoCard key={video._id} videoId={video._id} thumbnail={video.thumbnail}
                                avatar={video.owner?.avatar} title={video.title} username={video.owner?.username}
                                views={video.views} createdAt={video.createdAt} duration={video.duration} />
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default LikedVideos
