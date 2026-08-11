import { useState } from "react"
import { Search as SearchIcon } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Search() {
    const [query, setQuery] = useState("")
    const navigate = useNavigate()
    const location = useLocation()

    function handleSearch(e) {
        e.preventDefault()
        const q = query.trim()
        if (!q) return
        const isTweets = location.pathname.startsWith("/tweets")
        navigate(isTweets ? `/tweets?q=${encodeURIComponent(q)}` : `/?q=${encodeURIComponent(q)}`)
    }

    return (
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <div className="flex w-full h-10">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search videos, tweets..."
                    className="flex-1 px-4 rounded-l-full border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-blue-500 transition text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
                />
                <button
                    type="submit"
                    className="px-5 border border-l-0 border-zinc-300 rounded-r-full bg-zinc-100 hover:bg-zinc-200 transition dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                    <SearchIcon size={18} className="text-zinc-600 dark:text-zinc-300" />
                </button>
            </div>
        </form>
    )
}
