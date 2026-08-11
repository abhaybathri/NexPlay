import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { api } from "../api/axios"
import { ChannelTweet, ChannelPlaylist } from "../components"
import { Users, Video, Heart, Trash2, Plus, SlidersHorizontal } from "lucide-react"
import { toast } from "react-toastify"
import VideoCard from "../components/Card/VideoCard.jsx"
import { Link } from "react-router-dom"

// Owner video grid with delete
function OwnerVideoGrid({ userId }) {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return
        api.get(`/dashboard/get-videos/${userId}`)
            .then(res => setVideos(res.data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [userId])

    async function deleteVideo(videoId) {
        if (!window.confirm("Delete this video? This cannot be undone.")) return
        try {
            await api.delete(`/video/d/${videoId}`)
            setVideos(prev => prev.filter(v => v._id !== videoId))
            toast.success("Video deleted")
        } catch {
            toast.error("Could not delete video")
        }
    }

    if (loading) return (
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
            {[1,2,3].map(i => <div key={i} className="animate-pulse aspect-video rounded-xl bg-zinc-200 dark:bg-zinc-800" />)}
        </div>
    )

    if (videos.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-3">
            <Video size={40} className="opacity-30" />
            <p>No videos yet</p>
            <Link to="/video/publish"
                className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm text-white font-medium hover:bg-blue-700 transition">
                <Plus size={16} /> Upload your first video
            </Link>
        </div>
    )

    return (
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
            {videos.map(video => (
                <div key={video._id} className="relative group">
                    <VideoCard videoId={video._id} thumbnail={video.thumbnail} avatar={video.owner?.avatar}
                        title={video.title} username={video.owner?.username} views={video.views}
                        createdAt={video.createdAt} duration={video.duration} />
                    <button
                        onClick={() => deleteVideo(video._id)}
                        className="absolute top-2 left-2 rounded-lg bg-black/70 p-1.5 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                        title="Delete video"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
        </div>
    )
}

// Create playlist modal
function CreatePlaylistModal({ onClose, onCreated }) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [saving, setSaving] = useState(false)

    async function handleCreate(e) {
        e.preventDefault()
        if (!name.trim() || !description.trim()) { toast.error("Both fields are required"); return }
        setSaving(true)
        try {
            const res = await api.post("/playlist/create", { name: name.trim(), description: description.trim() })
            toast.success("Playlist created!")
            onCreated(res.data.data)
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not create playlist")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-5">New Playlist</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Playlist name"
                            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                            placeholder="What's this playlist about?"
                            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={saving}
                            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition">
                            {saving ? "Creating..." : "Create Playlist"}
                        </button>
                        <button type="button" onClick={onClose}
                            className="flex-1 rounded-lg border border-zinc-300 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Owner playlist grid with delete
function OwnerPlaylistGrid({ userId }) {
    const [playlists, setPlaylists] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (!userId) return
        api.get(`/playlist/user/${userId}`)
            .then(res => setPlaylists(res.data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [userId])

    async function deletePlaylist(playlistId) {
        if (!window.confirm("Delete this playlist?")) return
        try {
            await api.delete(`/playlist/${playlistId}`)
            setPlaylists(prev => prev.filter(p => p._id !== playlistId))
            toast.success("Playlist deleted")
        } catch {
            toast.error("Could not delete playlist")
        }
    }

    if (loading) return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="animate-pulse aspect-video rounded-xl bg-zinc-200 dark:bg-zinc-800" />)}
        </div>
    )

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <button onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                    <Plus size={16} /> New Playlist
                </button>
            </div>

            {playlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-2">
                    <SlidersHorizontal size={40} className="opacity-30" />
                    <p>No playlists yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {playlists.map(playlist => {
                        const thumb = playlist.videos?.[0]?.thumbnail
                        return (
                            <div key={playlist._id} className="group relative rounded-xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800">
                                    {thumb
                                        ? <img src={thumb} alt={playlist.name} className="h-full w-full object-cover" />
                                        : <div className="flex h-full items-center justify-center text-zinc-400 text-xs">No videos</div>
                                    }
                                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                                        {playlist.videos?.length || 0} videos
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1">{playlist.name}</p>
                                    <p className="text-xs text-zinc-500 line-clamp-1">{playlist.description}</p>
                                </div>
                                <button onClick={() => deletePlaylist(playlist._id)}
                                    className="absolute top-2 left-2 rounded-lg bg-black/70 p-1.5 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                                    title="Delete playlist">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

            {showModal && (
                <CreatePlaylistModal
                    onClose={() => setShowModal(false)}
                    onCreated={p => { setPlaylists(prev => [p, ...prev]); setShowModal(false) }}
                />
            )}
        </div>
    )
}

export function Channel() {
    const { username } = useParams()
    const currentUser = useSelector(state => state.auth.userData)
    const authStatus = useSelector(state => state.auth.status)

    const [channel, setChannel] = useState(null)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [subscribing, setSubscribing] = useState(false)
    const [activeTab, setActiveTab] = useState("videos")

    useEffect(() => {
        setLoading(true)
        setChannel(null)
        api.get(`/users/c/${username}`)
            .then(res => {
                setChannel(res.data.data)
                api.get(`/dashboard/get-channel-status/${res.data.data._id}`)
                    .then(sr => setStats(sr.data.data))
                    .catch(() => {})
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [username])

    async function toggleSubscribe() {
        if (!authStatus) { toast.info("Please sign in to subscribe"); return }
        if (!channel || subscribing) return
        setSubscribing(true)
        try {
            await api.post(`/subscription/toggle-subscribe/${channel._id}`)
            setChannel(prev => ({
                ...prev,
                isSubscribed: !prev.isSubscribed,
                subscribersCount: prev.isSubscribed
                    ? Math.max((prev.subscribersCount || 1) - 1, 0)
                    : (prev.subscribersCount || 0) + 1
            }))
            toast.success(channel.isSubscribed ? "Unsubscribed" : "Subscribed!")
        } catch { toast.error("Could not update subscription") }
        finally { setSubscribing(false) }
    }

    if (loading) return (
        <div className="animate-pulse">
            <div className="h-44 w-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="mx-auto max-w-5xl px-4 pt-5 flex gap-5">
                <div className="h-20 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-3 pt-2">
                    <div className="h-5 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
            </div>
        </div>
    )

    if (!channel) return (
        <div className="flex h-60 items-center justify-center text-zinc-400">Channel not found.</div>
    )

    const isOwner = currentUser?.username === channel.username
    const tabs = ["videos", "tweets", "playlists"]

    return (
        <div className="w-full pb-10">
            {/* Cover */}
            <div className="h-36 sm:h-52 w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                {channel.coverImage
                    ? <img src={channel.coverImage} alt="cover" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-linear-to-br from-blue-900 to-zinc-900" />
                }
            </div>

            <div className="mx-auto max-w-5xl px-4">
                {/* Avatar + info */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 pt-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
                    <img src={channel.avatar} alt={channel.fullname}
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-white dark:border-zinc-950 shrink-0 -mt-12 sm:-mt-14 bg-zinc-300" />
                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{channel.fullname}</h2>
                            <p className="text-sm text-zinc-500">@{channel.username}</p>
                            <p className="text-sm text-zinc-500 mt-0.5">
                                {channel.subscribersCount ?? 0} subscriber{channel.subscribersCount !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            {isOwner && (
                                <Link to="/settings"
                                    className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition">
                                    Edit Profile
                                </Link>
                            )}
                            {!isOwner && (
                                <button onClick={toggleSubscribe} disabled={subscribing}
                                    className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                                        channel.isSubscribed
                                            ? "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                    } disabled:opacity-60`}>
                                    {subscribing ? "..." : channel.isSubscribed ? "Subscribed" : "Subscribe"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="flex flex-wrap gap-5 py-3 border-b border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500">
                        <span className="flex items-center gap-1.5"><Video size={14} />{stats.totalVideosCount} videos</span>
                        <span className="flex items-center gap-1.5"><Users size={14} />{stats.totalSubscribersCount} subscribers</span>
                        <span className="flex items-center gap-1.5"><Heart size={14} />{stats.totalLikeCount} likes</span>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800 mt-1">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-5 py-3 text-sm font-medium capitalize transition ${
                                activeTab === tab
                                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                            }`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="py-6">
                    {activeTab === "videos" && (
                        isOwner
                            ? <OwnerVideoGrid userId={channel._id} />
                            : <PublicVideoGrid userId={channel._id} />
                    )}
                    {activeTab === "tweets" && <ChannelTweet userId={channel._id} />}
                    {activeTab === "playlists" && (
                        isOwner
                            ? <OwnerPlaylistGrid userId={channel._id} />
                            : <ChannelPlaylist userId={channel._id} />
                    )}
                </div>
            </div>
        </div>
    )
}

// Public video grid (non-owner view)
function PublicVideoGrid({ userId }) {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return
        api.get(`/dashboard/get-videos/${userId}`)
            .then(res => setVideos(res.data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [userId])

    if (loading) return (
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
            {[1,2,3].map(i => <div key={i} className="animate-pulse aspect-video rounded-xl bg-zinc-200 dark:bg-zinc-800" />)}
        </div>
    )

    if (videos.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <Video size={40} className="mb-3 opacity-30" />
            <p>No videos uploaded yet</p>
        </div>
    )

    return (
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
            {videos.map(video => (
                <VideoCard key={video._id} videoId={video._id} thumbnail={video.thumbnail}
                    avatar={video.owner?.avatar} title={video.title} username={video.owner?.username}
                    views={video.views} createdAt={video.createdAt} duration={video.duration} />
            ))}
        </div>
    )
}
