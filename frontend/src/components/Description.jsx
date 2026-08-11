import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ChevronDown, ChevronUp } from "lucide-react"

export function Description({ createdAt, content }) {
    const [expanded, setExpanded] = useState(false)
    const uploaded = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : ""
    const isLong = content && content.length > 300

    return (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Uploaded {uploaded}
            </p>
            <p className={`text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap ${!expanded && isLong ? "line-clamp-4" : ""}`}>
                {content || "No description available."}
            </p>
            {isLong && (
                <button onClick={() => setExpanded(p => !p)}
                    className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition">
                    {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show more</>}
                </button>
            )}
        </div>
    )
}
