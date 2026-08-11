import { useEffect, useRef, useState } from "react"
import { Video, FileText, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function PublishMenu() {
    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        function handleOutsideClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleOutsideClick)
        return () => document.removeEventListener("mousedown", handleOutsideClick)
    }, [])

    const options = [
        { icon: Video, label: "Upload Video", path: "/video/publish" },
        { icon: FileText, label: "Post Tweet", path: "/tweet/publish" },
    ]

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
                <Plus size={16} />
                Create
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-52 z-50 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
                    {options.map(option => {
                        const Icon = option.icon
                        return (
                            <button
                                key={option.label}
                                onClick={() => { navigate(option.path); setOpen(false) }}
                                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                            >
                                <Icon size={16} className="text-blue-400 shrink-0" />
                                {option.label}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
