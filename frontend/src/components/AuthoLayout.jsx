import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

// Wraps routes that require authentication
export default function AuthLayout({ children, requireAuth = true }) {
    const navigate = useNavigate()
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        if (requireAuth && !authStatus) {
            navigate("/signin", { replace: true })
        } else if (!requireAuth && authStatus) {
            navigate("/", { replace: true })
        }
    }, [authStatus, navigate, requireAuth])

    return <>{children}</>
}
