import { NavLink } from "react-router-dom"

export default function CategoryTabs() {
    const tabs = [
        { name: "Videos", path: "/" },
        { name: "Tweets", path: "/tweets" },
    ]

    return (
        <div className="sticky top-16 z-30 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex gap-2 px-4 sm:px-6 py-2.5">
                {tabs.map(tab => (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        end={tab.path === "/"}
                        className={({ isActive }) =>
                            `rounded-full px-5 py-1.5 text-sm font-medium transition ${
                                isActive
                                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
                            }`
                        }
                    >
                        {tab.name}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}
