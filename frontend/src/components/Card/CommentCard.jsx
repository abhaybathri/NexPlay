import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Heart, MoreVertical, Pencil, Trash2, Check, X, User } from "lucide-react"
import { api } from "../../api/axios"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

export function CommentCard({ content, createdAt, owner, commentId, initialLikes = 0, initialLiked = false, onDeleted }) {
    const [currentContent, setCurrentContent] = useState(content)
    const [editing, setEditing] = useState(false)
    const [editText, setEditText] = useState(content)
    const [saving, setSaving] = useState(false)
    const [liked, setLiked] = useState(initialLiked)
    const [likes, setLikes] = useState(initialLikes)
    const [likeLoading, setLikeLoading] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const currentUser = useSelector(state => state.auth.userData)
    const authStatus = useSelector(state => state.auth.status)
    const isOwner = authStatus && currentUser?._id === owner?._id

    async function toggleLike() {
        if (!authStatus) { toast.info("Please sign in to like"); return }
        if (likeLoading) return
        setLikeLoading(true)
        try {
            await api.post(`/like/toggle/c/${commentId}`)
            setLiked(p => !p)
            setLikes(p => liked ? Math.max(p - 1, 0) : p + 1)
        } catch { /* ignore */ }
        finally { setLikeLoading(false) }
    }

    async function saveEdit() {
        if (!editText.trim()) return
        if (editText === currentContent) { setEditing(false); return }
        setSaving(true)
        try {
            await api.patch(`/comment/${commentId}`, { newComment: editText.trim() })
            setCurrentContent(editText.trim())
            setEditing(false)
        } catch { toast.error("Could not update comment") }
        finally { setSaving(false) }
    }

    async function deleteComment() {
        setMenuOpen(false)
        try {
            await api.delete(`/comment/${commentId}`)
            if (onDeleted) onDeleted(commentId)
        } catch { toast.error("Could not delete comment") }
    }

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    {owner?.avatar
                        ? <img src={owner.avatar} alt={owner.username} className="h-full w-full object-cover" />
                        : <div className="flex h-full items-center justify-center"><User size={16} className="text-zinc-400" /></div>
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-zinc-900 dark:text-white">{owner?.username}</span>
                            <span className="text-xs text-zinc-500">
                                {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : ""}
                            </span>
                        </div>
                        {isOwner && (
                            <div className="relative shrink-0">
                                <button onClick={() => setMenuOpen(p => !p)}
                                    className="rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition">
                                    <MoreVertical size={15} />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 top-7 z-10 w-36 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                                        <button onClick={() => { setEditing(true); setMenuOpen(false) }}
                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition">
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button onClick={deleteComment}
                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-zinc-100 dark:text-red-400 dark:hover:bg-zinc-800 transition">
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {editing ? (
                        <div className="mt-2 space-y-2">
                            <textarea rows={3} value={editText} onChange={e => setEditText(e.target.value)}
                                className="w-full resize-none rounded-lg border border-zinc-300 bg-white p-2 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white transition" />
                            <div className="flex gap-2">
                                <button onClick={saveEdit} disabled={saving}
                                    className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-60 transition">
                                    <Check size={12} /> Save
                                </button>
                                <button onClick={() => setEditing(false)}
                                    className="flex items-center gap-1 rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition">
                                    <X size={12} /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                            {currentContent}
                        </p>
                    )}

                    <button onClick={toggleLike} disabled={likeLoading}
                        className={`mt-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition ${
                            liked
                                ? "border-red-400 bg-red-50 text-red-500 dark:border-red-500/50 dark:bg-red-500/10 dark:text-red-400"
                                : "border-zinc-300 text-zinc-500 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
                        } disabled:opacity-50`}
                    >
                        <Heart size={12} className={liked ? "fill-red-500 text-red-500 dark:fill-red-400" : ""} />
                        {likes > 0 ? likes : ""} Like
                    </button>
                </div>
            </div>
        </div>
    )
}
