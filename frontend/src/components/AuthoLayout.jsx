import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"



export default function AuthLayout({children}){
    const navigate = useNavigate()
const [loading,setLoading] = useState(true)
    const authstatus = useSelector((state)=> state.auth.status)
    useEffect(()=>{
        if(authstatus){
                navigate('/')
        }
        else{
            navigate('/login')
        }
        setLoading(false);
    },[
authstatus, navigate
    ])
    return loading ? <h1>loading...</h1> : <>{children}</>
}