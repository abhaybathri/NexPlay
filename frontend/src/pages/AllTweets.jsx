import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { api } from "../api/axios.js"
import { TweetCard } from "../components/index.js"
import { Search, MessageSquareOff } from "lucide-react"

export default function AllTweets() {
    const [tweets, setTweets] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q") || ""

    const fetchTweets = useCallback(async (pageNum = 1) => {
        setLoading(true)
        try {
            const params = { page: pageNum, limit: 10 }
            if (query) params.query = query
            const response = await api.get("/tweet/get-tweets", { params })
            const data = response.data.data
            setTweets(data.docs || [])
            setTotalPages(data.totalPages || 1)
            setPage(data.page || 1)
        } catch {
            setTweets([])
        } finally {
            setLoading(false)
        }
    }, [query])

    useEffect(() => { fetchTweets(1) }, [fetchTweets])

    if (loading) {
        return (
            <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
                        <div className="flex gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                            <div className="space-y-2 flex-1 pt-1">
                                <div className="h-3.5 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                                <div className="h-3 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
                            <div className="h-3 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
            {query && (
                <p className="text-sm text-zinc-500">
                    Results for <span className="font-medium text-zinc-900 dark:text-white">"{query}"</span>
                </p>
            )}
            {tweets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
                    {query
                        ? <><Search size={48} className="mb-4 opacity-30" /><p className="text-lg">No tweets for "{query}"</p></>
                        : <><MessageSquareOff size={48} className="mb-4 opacity-30" /><p className="text-lg">No tweets yet</p></>
                    }
                </div>
            ) : (
                <>
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
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <button onClick={() => fetchTweets(page - 1)} disabled={page === 1}
                                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                Previous
                            </button>
                            <span className="text-sm text-zinc-500">{page} / {totalPages}</span>
                            <button onClick={() => fetchTweets(page + 1)} disabled={page === totalPages}
                                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
