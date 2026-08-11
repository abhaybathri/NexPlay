import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, User } from "lucide-react"
import { api } from "../../api/axios"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

export default function TweetCard({ tweetId, content, user, uploadedAt, initialLikes = 0, initiallyLiked = false }) {
    const [expanded, setExpanded] = useState(false)
    const [likes, setLikes] = useState(initialLikes)
    const [liked, setLiked] = useState(initiallyLiked)
    const [loading, setLoading] = useState(false)
    const authStatus = useSelector(state => state.auth.status)

    const uploaded = uploadedAt ? formatDistanceToNow(new Date(uploadedAt), { addSuffix: true }) : ""
    const isLong = content.length > 200

    async function toggleLike() {
        if (loading) return
        if (!authStatus) { toast.info("Please sign in to like tweets"); return }
        setLoading(true)
        try {
            await api.post(`/like/toggle/t/${tweetId}`)
            setLiked(prev => !prev)
            setLikes(prev => liked ? Math.max(prev - 1, 0) : prev + 1)
        } catch { /* ignore */ }
        finally { setLoading(false) }
    }

    return (
        <div className="w-full rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-300 transition dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
            <div className="flex items-center gap-3 mb-4">
                <Link to={`/channel/${user?.username}`} className="shrink-0">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                        {user?.avatar
                            ? <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                            : <div className="flex h-full items-center justify-center"><User size={18} className="text-zinc-400" /></div>
                        }
                    </div>
                </Link>
                <div>
                    <Link to={`/channel/${user?.username}`}
                        className="text-sm font-semibold text-zinc-900 hover:text-blue-600 transition dark:text-white dark:hover:text-blue-400">
                        {user?.username}
                    </Link>
                    <p className="text-xs text-zinc-500">{uploaded}</p>
                </div>
            </div>

            <p className={`text-sm text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed ${!expanded && isLong ? "line-clamp-4" : ""}`}>
                {content}
            </p>
            {isLong && (
                <button onClick={() => setExpanded(p => !p)}
                    className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition">
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}

            <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <button onClick={toggleLike} disabled={loading}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                        liked
                            ? "border-red-400 bg-red-50 text-red-500 dark:border-red-500/50 dark:bg-red-500/10 dark:text-red-400"
                            : "border-zinc-300 text-zinc-500 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
                    } disabled:opacity-50`}
                >
                    <Heart size={13} className={liked ? "fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400" : ""} />
                    {likes} {likes === 1 ? "like" : "likes"}
                </button>
            </div>
        </div>
    )
}
