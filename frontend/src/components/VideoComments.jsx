import { useEffect, useState } from "react"
import { api } from "../api/axios.js"
import { CommentCard } from "./Card/CommentCard.jsx"
import { MessageSquare } from "lucide-react"

export function VideoComment({ videoId, refresh = 0 }) {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!videoId) return
        setLoading(true)
        setError("")
        api.get(`/comment/${videoId}`)
            .then(res => setComments(res.data.data.docs || []))
            .catch(() => setError("Unable to load comments."))
            .finally(() => setLoading(false))
    }, [videoId, refresh])

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                        <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                        <div className="flex-1 space-y-2 pt-1">
                            <div className="h-3 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                            <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                {error}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-white">
                <MessageSquare size={17} />
                {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
            </h2>

            {comments.length === 0 ? (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                    No comments yet. Be the first!
                </div>
            ) : (
                comments.map(comment => (
                    <CommentCard
                        key={comment._id}
                        commentId={comment._id}
                        owner={comment.owner}
                        content={comment.content}
                        createdAt={comment.createdAt}
                        initialLikes={comment.likesCount || 0}
                        initialLiked={comment.isLikedByUser || false}
                    />
                ))
            )}
        </div>
    )
}
