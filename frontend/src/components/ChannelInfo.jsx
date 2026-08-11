import { useEffect, useState } from "react"
import { api } from "../api/axios"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { User } from "lucide-react"
import { toast } from "react-toastify"

export function ChannelInfo({ owner }) {
    const [channel, setChannel] = useState(null)
    const [loading, setLoading] = useState(true)
    const [subscribing, setSubscribing] = useState(false)
    const authStatus = useSelector(state => state.auth.status)
    const currentUser = useSelector(state => state.auth.userData)

    useEffect(() => {
        if (!owner?.username) return
        setLoading(true)
        api.get(`/users/c/${owner.username}`)
            .then(res => setChannel(res.data.data))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [owner?.username])

    async function toggleSubscribe() {
        if (!authStatus) {
            toast.info("Please sign in to subscribe")
            return
        }
        if (!channel || subscribing) return
        setSubscribing(true)
        try {
            await api.post(`/subscription/toggle-subscribe/${channel._id}`)
            setChannel(prev => ({
                ...prev,
                isSubscribed: !prev.isSubscribed,
                subscribersCount: prev.isSubscribed
                    ? Math.max((prev.subscribersCount || 1) - 1, 0)
                    : (prev.subscribersCount || 0) + 1,
            }))
        } catch {
            toast.error("Could not update subscription")
        } finally {
            setSubscribing(false)
        }
    }

    if (loading) {
        return (
            <div className="animate-pulse flex items-center gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
            </div>
        )
    }

    if (!channel) return null

    const isOwner = currentUser?.username === channel.username

    return (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4 gap-4 dark:border-zinc-800 dark:bg-zinc-900">
            <Link to={`/channel/${channel.username}`} className="flex items-center gap-3 min-w-0">
                <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    {owner?.avatar
                        ? <img src={owner.avatar} alt={owner.username} className="h-full w-full object-cover" />
                        : <div className="flex h-full items-center justify-center"><User size={20} className="text-zinc-400" /></div>
                    }
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-zinc-900 dark:text-white truncate">{owner?.username}</p>
                    <p className="text-xs text-zinc-500">
                        {channel.subscribersCount ?? 0} {channel.subscribersCount === 1 ? "subscriber" : "subscribers"}
                    </p>
                </div>
            </Link>

            {!isOwner && (
                <button
                    onClick={toggleSubscribe}
                    disabled={subscribing}
                    className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition ${
                        channel.isSubscribed
                            ? "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                            : "bg-red-600 text-white hover:bg-red-700"
                    } disabled:opacity-60`}
                >
                    {subscribing ? "..." : channel.isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
            )}
        </div>
    )
}
