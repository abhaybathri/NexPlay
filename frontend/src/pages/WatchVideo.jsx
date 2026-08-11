import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../api/axios.js"
import { VideoPlayer } from "../components/VideoPlayer.jsx"
import { VideoActions } from "../components/VideoActions.jsx"
import { ChannelInfo } from "../components/ChannelInfo.jsx"
import { Description } from "../components/Description.jsx"
import { PostComment } from "../components/PostComment.jsx"
import { VideoComment } from "../components/VideoComments.jsx"

export function WatchVideo() {
    const { videoId } = useParams()
    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [commentRefresh, setCommentRefresh] = useState(0)

    useEffect(() => {
        if (!videoId) return
        setLoading(true)
        setVideo(null)
        api.get(`/video/g/${videoId}`)
            .then(res => setVideo(res.data.data))
            .catch(err => console.error("Failed to fetch video:", err))
            .finally(() => setLoading(false))
    }, [videoId])

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-6 animate-pulse space-y-4">
                <div className="w-full rounded-xl bg-zinc-800" style={{ aspectRatio: '16/9' }} />
                <div className="h-6 w-2/3 rounded bg-zinc-800" />
                <div className="h-4 w-1/3 rounded bg-zinc-800" />
            </div>
        )
    }

    if (!video) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-zinc-400">
                Video not found.
            </div>
        )
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 flex flex-col gap-5">
            {/* Full-width responsive player */}
            <div className="w-full overflow-hidden rounded-xl bg-black" style={{ aspectRatio: '16/9' }}>
                <VideoPlayer videoUrl={video.videoUrl} />
            </div>

            <VideoActions title={video.title} views={video.views} videoId={video._id} videoUrl={video.videoUrl} />
            <ChannelInfo owner={video.owner} />
            <Description createdAt={video.createdAt} content={video.description} />

            <div className="space-y-5">
                <PostComment videoId={video._id} onPosted={() => setCommentRefresh(n => n + 1)} />
                <VideoComment videoId={video._id} refresh={commentRefresh} />
            </div>
        </div>
    )
}
