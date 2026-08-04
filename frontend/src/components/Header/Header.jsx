import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {Button, PublishMenu} from "../index.js";
import Logo from "./Logo.jsx";
import ProfileMenu from "./Profile.jsx";
import Search from "./Search.jsx";

export default function Header() {

    const authStatus = useSelector(state => state.auth.status);
    const navigate = useNavigate();

    return (
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 px-6">

            <Logo />

            <Search />

            <div className="flex items-center gap-3">

                {authStatus && (
                    <PublishMenu />
                )}

                {!authStatus && (
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/signin")}
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
    );
}