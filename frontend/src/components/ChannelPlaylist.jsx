import { useEffect, useState } from "react"
import { api } from "../api/axios.js"
import { ListVideo, Play } from "lucide-react"

export function ChannelPlaylist({ userId }) {
    const [playlists, setPlaylists] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return
        api.get(`/playlist/user/${userId}`)
            .then(res => setPlaylists(res.data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [userId])

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 aspect-video" />
                ))}
            </div>
        )
    }

    if (playlists.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <ListVideo size={40} className="mb-3 opacity-30" />
                <p>No playlists yet</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {playlists.map(playlist => {
                const firstThumb = playlist.videos?.[0]?.thumbnail
                return (
                    <div key={playlist._id}
                        className="group rounded-xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 transition dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
                        <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800">
                            {firstThumb ? (
                                <img src={firstThumb} alt={playlist.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <ListVideo size={32} className="text-zinc-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                                <Play size={28} className="text-white fill-white" />
                            </div>
                            <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                                {playlist.videos?.length || 0} videos
                            </div>
                        </div>
                        <div className="p-3">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1">{playlist.name}</p>
                            <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{playlist.description}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
