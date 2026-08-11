import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { api } from './api/axios.js'
import { login, logout } from './store/authSlice.js'
import { Header } from './components/index.js'

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        // silently check if user is already logged in via cookie
        api.get("/users/user")
            .then(({ data }) => dispatch(login({ userData: data.data })))
            .catch(() => dispatch(logout())) // expected when not logged in
    }, [dispatch])

    return (
        <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">
            <Header />
            <main>
                <Outlet />
            </main>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                theme="dark"
                toastClassName="!rounded-xl !text-sm"
            />
        </div>
    )
}

export default App
