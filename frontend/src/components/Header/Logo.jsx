import { Link } from "react-router-dom"
import { Play } from "lucide-react"

export default function Logo() {
    return (
        <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                <Play size={18} fill="white" />
            </div>
            <div className="hidden sm:block leading-tight">
                <h1 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">NexPlay</h1>
                <p className="text-[10px] text-zinc-500 -mt-0.5">Share. Watch. Connect.</p>
            </div>
        </Link>
    )
}
