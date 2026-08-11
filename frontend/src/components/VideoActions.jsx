import { useState, useEffect, useRef } from "react"
import { Heart, Share2, Eye, Download, ListPlus, Check, Plus, X } from "lucide-react"
import { api } from "../api/axios"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

// Modal that shows user's playlists and lets them add/remove the video
function SaveToPlaylistModal({ videoId, onClose }) {
    const [playlists, setPlaylists] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(null) // playlistId being saved
    const [creating, setCreating] = useState(false)
    const [newName, setNewName] = useState("")
    const [newDesc, setNewDesc] = useState("")
    const [creatingLoading, setCreatingLoading] = useState(false)
    const userData = useSelector(state => state.auth.userData)
    const modalRef = useRef(null)

    useEffect(() => {
        if (!userData?._id) return
        api.get(`/playlist/user/${userData._id}`)
            .then(res => setPlaylists(res.data.data || []))
            .catch(() => toast.error("Could not load playlists"))
            .finally(() => setLoading(false))
    }, [userData?._id])

    // Close on outside click
    useEffect(() => {
        function handle(e) {
            if (modalRef.current && !modalRef.current.contains(e.target)) onClose()
        }
        document.addEventListener("mousedown", handle)
        return () => document.removeEventListener("mousedown", handle)
    }, [onClose])

    function isVideoInPlaylist(playlist) {
        return playlist.videos?.some(v => {
            const id = typeof v === "string" ? v : v._id
            return id === videoId
        })
    }

    async function toggleVideoInPlaylist(playlist) {
        if (saving) return
        const alreadyIn = isVideoInPlaylist(playlist)
        setSaving(playlist._id)
        try {
            if (alreadyIn) {
                await api.delete(`/playlist/remove/${videoId}/${playlist._id}`)
                setPlaylists(prev => prev.map(p =>
                    p._id === playlist._id
                        ? { ...p, videos: p.videos.filter(v => (typeof v === "string" ? v : v._id) !== videoId) }
                        : p
                ))
                toast.success(`Removed from "${playlist.name}"`)
            } else {
                await api.post(`/playlist/add/${videoId}/${playlist._id}`)
                setPlaylists(prev => prev.map(p =>
                    p._id === playlist._id
                        ? { ...p, videos: [...(p.videos || []), videoId] }
                        : p
                ))
                toast.success(`Saved to "${playlist.name}"`)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not update playlist")
        } finally {
            setSaving(null)
        }
    }

    async function createAndAdd(e) {
        e.preventDefault()
        if (!newName.trim() || !newDesc.trim()) { toast.error("Name and description required"); return }
        setCreatingLoading(true)
        try {
            const res = await api.post("/playlist/create", { name: newName.trim(), description: newDesc.trim() })
            const newPlaylist = res.data.data
            // immediately add video to the new playlist
            await api.post(`/playlist/add/${videoId}/${newPlaylist._id}`)
            newPlaylist.videos = [videoId]
            setPlaylists(prev => [newPlaylist, ...prev])
            setCreating(false)
            setNewName("")
            setNewDesc("")
            toast.success(`Saved to "${newPlaylist.name}"`)
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not create playlist")
        } finally {
            setCreatingLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-4 sm:pb-0">
            <div ref={modalRef}
                className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Save to playlist</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition">
                        <X size={18} />
                    </button>
                </div>

                {/* Playlists */}
                <div className="max-h-64 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500" />
                        </div>
                    ) : playlists.length === 0 ? (
                        <p className="py-8 text-center text-sm text-zinc-400">No playlists yet</p>
                    ) : (
                        playlists.map(pl => {
                            const inList = isVideoInPlaylist(pl)
                            const isSaving = saving === pl._id
                            return (
                                <button key={pl._id} onClick={() => toggleVideoInPlaylist(pl)}
                                    disabled={!!saving}
                                    className="flex w-full items-center gap-3 px-5 py-3.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-50">
                                    {/* Checkbox */}
                                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                                        inList ? "border-blue-600 bg-blue-600" : "border-zinc-400 dark:border-zinc-600"
                                    }`}>
                                        {inList && <Check size={12} className="text-white" strokeWidth={3} />}
                                        {isSaving && <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />}
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{pl.name}</p>
                                        <p className="text-xs text-zinc-500">{pl.videos?.length || 0} videos</p>
                                    </div>
                                </button>
                            )
                        })
                    )}
                </div>

                {/* Create new playlist */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 px-5 py-3">
                    {creating ? (
                        <form onSubmit={createAndAdd} className="space-y-2">
                            <input value={newName} onChange={e => setNewName(e.target.value)}
                                placeholder="Playlist name"
                                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                            <input value={newDesc} onChange={e => setNewDesc(e.target.value)}
                                placeholder="Description"
                                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                            <div className="flex gap-2 pt-1">
                                <button type="submit" disabled={creatingLoading}
                                    className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition">
                                    {creatingLoading ? "Creating..." : "Create & Save"}
                                </button>
                                <button type="button" onClick={() => setCreating(false)}
                                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={() => setCreating(true)}
                            className="flex w-full items-center gap-2 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition">
                            <Plus size={16} /> Create new playlist
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export function VideoActions({ title, views = 0, videoId, videoUrl }) {
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showPlaylist, setShowPlaylist] = useState(false)
    const authStatus = useSelector(state => state.auth.status)

    async function toggleLike() {
        if (loading || !videoId) return
        if (!authStatus) { toast.info("Please sign in to like videos"); return }
        setLoading(true)
        try {
            await api.post(`/like/toggle/v/${videoId}`)
            setLiked(prev => !prev)
            setLikes(prev => liked ? Math.max(prev - 1, 0) : prev + 1)
        } catch {
            toast.error("Failed to update like")
        } finally {
            setLoading(false)
        }
    }

    async function share() {
        try {
            if (navigator.share) {
                await navigator.share({ title, url: window.location.href })
            } else {
                await navigator.clipboard.writeText(window.location.href)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }
        } catch { /* user cancelled */ }
    }

    function formatViews(n) {
        if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
        if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
        return String(n)
    }

    function handleSaveToPlaylist() {
        if (!authStatus) { toast.info("Please sign in to save videos"); return }
        setShowPlaylist(true)
    }

    return (
        <>
            <div className="space-y-3">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white leading-snug">{title}</h1>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-3">
                    <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                        <Eye size={15} />
                        {formatViews(views)} views
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Like */}
                        <button onClick={toggleLike} disabled={loading}
                            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                                liked
                                    ? "border-red-500 bg-red-500/10 text-red-500"
                                    : "border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
                            } disabled:opacity-50`}>
                            <Heart size={15} className={liked ? "fill-red-500 text-red-500" : ""} />
                            {likes > 0 ? likes : ""} {likes === 1 ? "Like" : "Likes"}
                        </button>

                        {/* Save to playlist */}
                        <button onClick={handleSaveToPlaylist}
                            className="flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 transition dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500">
                            <ListPlus size={15} />
                            Save
                        </button>

                        {/* Share */}
                        <button onClick={share}
                            className="flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 transition dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500">
                            <Share2 size={15} />
                            {copied ? "Copied!" : "Share"}
                        </button>

                        {/* Download */}
                        {videoUrl && (
                            <a href={videoUrl} download target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 transition dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500">
                                <Download size={15} />
                                Download
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {showPlaylist && (
                <SaveToPlaylistModal
                    videoId={videoId}
                    onClose={() => setShowPlaylist(false)}
                />
            )}
        </>
    )
}
