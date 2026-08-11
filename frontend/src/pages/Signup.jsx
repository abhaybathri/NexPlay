import { useForm } from "react-hook-form"
import { Button, Input } from "../components"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { api } from "../api/axios.js"

export function Signup() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
    const navigate = useNavigate()
    const [error, setError] = useState("")

    const onSubmit = async (data) => {
        setError("")
        try {
            const formData = new FormData()
            formData.append("fullname", data.fullname.trim())
            formData.append("username", data.username.trim().toLowerCase())
            formData.append("email", data.email.trim())
            formData.append("password", data.password)
            formData.append("avatar", data.avatar[0])
            if (data.coverImage?.length) formData.append("coverImage", data.coverImage[0])
            await api.post("/users/register", formData)
            reset()
            navigate("/signin")
        } catch (err) {
            setError(err.response?.data?.message || "Unable to create account. Please try again.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create account</h1>
                    <p className="mt-1 text-sm text-zinc-500">Join NexPlay and start sharing.</p>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Full Name" placeholder="Your full name" autoComplete="name"
                        error={errors.fullname?.message}
                        {...register("fullname", { required: "Full name is required", minLength: { value: 3, message: "Minimum 3 characters" } })}
                    />
                    <Input label="Username" placeholder="yourhandle" autoComplete="username"
                        error={errors.username?.message}
                        {...register("username", { required: "Username is required", pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Letters, numbers, underscores only" } })}
                    />
                    <Input label="Email" type="email" placeholder="you@example.com" autoComplete="email"
                        error={errors.email?.message}
                        {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })}
                    />
                    <Input label="Password" type="password" placeholder="Min 8 characters" autoComplete="new-password"
                        error={errors.password?.message}
                        {...register("password", { required: "Password is required", minLength: { value: 8, message: "At least 8 characters" } })}
                    />
                    <Input label="Avatar" type="file" accept="image/*"
                        error={errors.avatar?.message}
                        {...register("avatar", { required: "Avatar is required" })}
                    />
                    <Input label="Cover Image (optional)" type="file" accept="image/*"
                        error={errors.coverImage?.message}
                        {...register("coverImage")}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
                        {isSubmitting ? "Creating account..." : "Create Account"}
                    </Button>
                </form>

                <p className="mt-5 text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link to="/signin" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">Sign In</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
