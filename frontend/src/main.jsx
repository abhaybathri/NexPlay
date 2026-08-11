import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
    Home, HomeTweet, Login, Signup,
    UploadTweet, UploadVideo, WatchVideo,
    Channel, UpdateAvatar, Setting, WatchHistory, LikedVideos
} from './pages/index.js'

// Apply saved theme — default to dark
const savedTheme = localStorage.getItem("nexplay-theme")
if (savedTheme === "light") {
    document.documentElement.classList.remove("dark")
} else {
    // default to dark mode if no preference saved
    document.documentElement.classList.add("dark")
    if (!savedTheme) localStorage.setItem("nexplay-theme", "dark")
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/signin", element: <Login /> },
            { path: "/signup", element: <Signup /> },
            { path: "/video/publish", element: <UploadVideo /> },
            { path: "/tweet/publish", element: <UploadTweet /> },
            { path: "/tweets", element: <HomeTweet /> },
            { path: "/watch/:videoId", element: <WatchVideo /> },
            { path: "/channel/:username", element: <Channel /> },
            { path: "/user/update-avatar", element: <UpdateAvatar /> },
            { path: "/settings", element: <Setting /> },
            { path: "/history", element: <WatchHistory /> },
            { path: "/liked", element: <LikedVideos /> },
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
)
