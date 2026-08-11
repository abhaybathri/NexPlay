import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { User, Settings, Moon, Sun, LogOut, Heart, Clock3 } from "lucide-react"
import { logout } from "../../store/authSlice.js"
import { api } from "../../api/axios.js"

export default function ProfileMenu() {
    const [open, setOpen] = useState(false)
    const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))
    const menuRef = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    function toggleDark() {
        const html = document.documentElement
        if (html.classList.contains("dark")) {
            html.classList.remove("dark")
            localStorage.setItem("nexplay-theme", "light")
            setDark(false)
        } else {
            html.classList.add("dark")
            localStorage.setItem("nexplay-theme", "dark")
            setDark(true)
        }
    }

    async function handleLogout() {
        try { await api.post("/users/logout") } catch { /* ignore */ }
        dispatch(logout())
        navigate("/signin")
        setOpen(false)
    }

    function go(path) { navigate(path); setOpen(false) }

    const menuItems = [
        { icon: User, label: "My Channel", action: () => go(`/channel/${userData?.username}`) },
        { icon: Clock3, label: "Watch History", action: () => go("/history") },
        { icon: Heart, label: "Liked Videos", action: () => go("/liked") },
        { icon: Settings, label: "Settings", action: () => go("/settings") },
        { icon: dark ? Sun : Moon, label: dark ? "Light Mode" : "Dark Mode", action: toggleDark },
        { icon: LogOut, label: "Sign Out", action: handleLogout, danger: true },
    ]

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(p => !p)}
                className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden border-2 border-zinc-300 hover:border-blue-500 transition dark:border-zinc-700"
            >
                {userData?.avatar
                    ? <img src={userData.avatar} alt={userData.username} className="h-full w-full object-cover" />
                    : <User size={20} className="text-zinc-500 dark:text-zinc-300" />
                }
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-56 z-50 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/50">
                    {userData && (
                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                {userData.fullname || userData.username}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">@{userData.username}</p>
                        </div>
                    )}
                    {menuItems.map(item => {
                        const Icon = item.icon
                        return (
                            <button key={item.label} onClick={item.action}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                                    item.danger
                                        ? "text-red-500 dark:text-red-400"
                                        : "text-zinc-700 dark:text-zinc-300"
                                }`}
                            >
                                <Icon size={16} />
                                <span>{item.label}</span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
