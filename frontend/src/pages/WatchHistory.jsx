import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { api } from "../api/axios.js"
import { VideoCard } from "../components/index.js"
import { Clock3 } from "lucide-react"

export function WatchHistory() {
    const authStatus = useSelector(state => state.auth.status)
    const userData = useSelector(state => state.auth.userData)
    const navigate = useNavigate()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [authChecked, setAuthChecked] = useState(false)

    // Wait for the initial auth check in App.jsx to complete
    // userData being non-null means auth check finished and user IS logged in
    // authStatus false + authChecked means not logged in
    useEffect(() => {
        // App.jsx sets auth status on mount — give it a moment
        const timer = setTimeout(() => setAuthChecked(true), 600)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!authChecked) return
        if (!authStatus) {
            navigate("/signin")
            return
        }
        setLoading(true)
        api.get("/users/history")
            .then(({ data }) => setVideos(data.data || []))
            .catch(() => setVideos([]))
            .finally(() => setLoading(false))
    }, [authChecked, authStatus, navigate])

    // Show spinner while waiting for auth check
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
                <Clock3 size={22} className="text-blue-500" />
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Watch History</h1>
            </div>

            {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-zinc-400 gap-2">
                    <Clock3 size={48} className="opacity-30" />
                    <p className="text-lg">No watch history yet</p>
                    <p className="text-sm">Videos you watch will appear here</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            )}
        </div>
    )
}

export default WatchHistory
