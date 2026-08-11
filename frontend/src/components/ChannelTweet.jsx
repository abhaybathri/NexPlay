import { useEffect, useState } from "react"
import { api } from "../api/axios"
import TweetCard from "./Card/TweetCard"
import { MessageSquareOff } from "lucide-react"

export function ChannelTweet({ userId }) {
    const [tweets, setTweets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return
        api.get(`/tweet/get-channel-tweet/${userId}`)
            .then(res => setTweets(res.data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [userId])

    if (loading) {
        return (
            <div className="space-y-4 max-w-2xl">
                {[1, 2].map(i => (
                    <div key={i} className="animate-pulse rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
                        <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                            <div className="space-y-2 flex-1 pt-1">
                                <div className="h-3 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                                <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (tweets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <MessageSquareOff size={40} className="mb-3 opacity-30" />
                <p>No tweets yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 max-w-2xl">
            {tweets.map(tweet => (
                <TweetCard
                    key={tweet._id}
                    tweetId={tweet._id}
                    content={tweet.content}
                    user={tweet.owner}
                    uploadedAt={tweet.createdAt}
                    initialLikes={tweet.likesCount}
                />
            ))}
        </div>
    )
}
