import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { User } from "lucide-react"

export default function VideoCard({ videoId, thumbnail, avatar, title, username, views, createdAt, duration }) {
    const uploaded = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : ""

    function formatDuration(seconds) {
        if (!seconds) return "0:00"
        seconds = Math.floor(seconds)
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        if (hrs > 0) return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
        return `${mins}:${String(secs).padStart(2, "0")}`
    }

    function formatViews(n = 0) {
        if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
        if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
        return String(n)
    }

    return (
        <Link to={`/watch/${videoId}`} className="group block">
            <div className="relative overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800">
                {thumbnail ? (
                    <img src={thumbnail} alt={title}
                        className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy" />
                ) : (
                    <div className="aspect-video w-full flex items-center justify-center text-zinc-400 text-xs">No thumbnail</div>
                )}
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                    {formatDuration(duration)}
                </span>
            </div>
            <div className="mt-3 flex gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    {avatar
                        ? <img src={avatar} alt={username} className="h-full w-full object-cover" />
                        : <div className="flex h-full items-center justify-center"><User size={16} className="text-zinc-400" /></div>
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-white leading-snug">{title}</h3>
                    <p className="mt-0.5 text-xs text-zinc-500">{username}</p>
                    <p className="text-xs text-zinc-500">{formatViews(views)} views • {uploaded}</p>
                </div>
            </div>
        </Link>
    )
}
