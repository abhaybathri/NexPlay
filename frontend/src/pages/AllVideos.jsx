import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { api } from "../api/axios.js"
import { VideoCard } from "../components/index.js"
import { Search, VideoOff, SlidersHorizontal } from "lucide-react"

export function AllVideos() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [sortBy, setSortBy] = useState("createdAt")
    const [sortType, setSortType] = useState("desc")

    const [searchParams] = useSearchParams()
    const query = searchParams.get("q") || ""

    const fetchVideos = useCallback(async (pageNum = 1) => {
        setLoading(true)
        try {
            const params = { page: pageNum, limit: 12, sortBy, sortType }
            if (query) params.query = query
            const response = await api.get("/video/", { params })
            const data = response.data.data
            setVideos(data.docs || [])
            setTotalPages(data.totalPages || 1)
            setPage(data.page || 1)
        } catch {
            setVideos([])
        } finally {
            setLoading(false)
        }
    }, [query, sortBy, sortType])

    useEffect(() => { fetchVideos(1) }, [fetchVideos])

    const sortOptions = [
        { label: "Newest", sortBy: "createdAt", sortType: "desc" },
        { label: "Oldest", sortBy: "createdAt", sortType: "asc" },
        { label: "Most Viewed", sortBy: "views", sortType: "desc" },
        { label: "A–Z", sortBy: "title", sortType: "asc" },
    ]

    return (
        <div className="space-y-5">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                {query ? (
                    <p className="text-sm text-zinc-500">
                        Results for <span className="font-semibold text-zinc-900 dark:text-white">"{query}"</span>
                    </p>
                ) : <span />}

                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={15} className="text-zinc-400" />
                    <select
                        value={`${sortBy}:${sortType}`}
                        onChange={e => {
                            const [sb, st] = e.target.value.split(":")
                            setSortBy(sb)
                            setSortType(st)
                        }}
                        className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                        {sortOptions.map(o => (
                            <option key={o.label} value={`${o.sortBy}:${o.sortType}`}>{o.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-video w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                            <div className="mt-3 flex gap-3">
                                <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <div className="h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
                                    <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
                    {query
                        ? <><Search size={48} className="mb-4 opacity-30" /><p className="text-lg">No results for "{query}"</p></>
                        : <><VideoOff size={48} className="mb-4 opacity-30" /><p className="text-lg">No videos yet. Be the first to upload!</p></>
                    }
                </div>
            ) : (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {videos.map(video => (
                            <VideoCard key={video._id} videoId={video._id} thumbnail={video.thumbnail}
                                avatar={video.owner?.avatar} title={video.title} username={video.owner?.username}
                                views={video.views} createdAt={video.createdAt} duration={video.duration} />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button onClick={() => fetchVideos(page - 1)} disabled={page === 1}
                                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                Previous
                            </button>
                            <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
                            <button onClick={() => fetchVideos(page + 1)} disabled={page === totalPages}
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
