import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

// Redirect to settings avatar section
export function UpdateAvatar() {
    const navigate = useNavigate()
    useEffect(() => {
        navigate("/settings", { replace: true })
    }, [navigate])
    return null
}

export default UpdateAvatar
