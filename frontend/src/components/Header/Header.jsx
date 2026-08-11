import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button, PublishMenu } from "../index.js"
import Logo from "./Logo.jsx"
import ProfileMenu from "./Profile.jsx"
import Search from "./Search.jsx"

export default function Header() {
    const authStatus = useSelector(state => state.auth.status)
    const navigate = useNavigate()

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/95 backdrop-blur-sm px-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-950/95">
            <Logo />
            <Search />
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {authStatus && <PublishMenu />}
                {!authStatus && (
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/signin")}
                            className="hidden sm:inline-flex"
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </Button>
                    </>
                )}
                {authStatus && <ProfileMenu />}
            </div>
        </header>
    )
}
