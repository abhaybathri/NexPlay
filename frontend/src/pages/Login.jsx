import { useForm } from "react-hook-form"
import { Button, Input } from "../components"
import { api } from "../api/axios"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { login as authLogin } from "../store/authSlice"
import { Link, useNavigate } from "react-router-dom"

export function Login() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        setError("")
        try {
            const response = await api.post("/users/login", data)
            dispatch(authLogin({ userData: response.data.data }))
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome back</h1>
                    <p className="mt-1 text-sm text-zinc-500">Sign in to continue to NexPlay.</p>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Email" type="email" placeholder="you@example.com" autoComplete="email"
                        error={errors.email?.message}
                        {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })}
                    />
                    <Input label="Password" type="password" placeholder="Your password" autoComplete="current-password"
                        error={errors.password?.message}
                        {...register("password", { required: "Password is required", minLength: { value: 8, message: "At least 8 characters" } })}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <p className="mt-5 text-center text-sm text-zinc-500">
                    Don't have an account?{" "}
                    <Link to="/signup" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">Sign Up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
