import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { api } from "../api/axios.js"
import { Send, User } from "lucide-react"

export function PostComment({ videoId, onPosted }) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
    const [error, setError] = useState("")
    const authStatus = useSelector(state => state.auth.status)
    const userData = useSelector(state => state.auth.userData)

    async function onSubmit(data) {
        setError("")
        try {
            await api.post(`/comment/${videoId}`, data)
            reset()
            if (onPosted) onPosted()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to post comment.")
        }
    }

    if (!authStatus) {
        return (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                <Link to="/signin" className="text-blue-600 hover:underline dark:text-blue-400">Sign in</Link> to leave a comment.
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-white">Add a Comment</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="flex gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 mt-0.5">
                        {userData?.avatar
                            ? <img src={userData.avatar} alt="" className="h-full w-full object-cover" />
                            : <div className="flex h-full items-center justify-center"><User size={16} className="text-zinc-400" /></div>
                        }
                    </div>
                    <div className="flex-1">
                        <textarea rows={3} placeholder="Write your comment..."
                            className="w-full resize-none rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
                            {...register("content", {
                                required: "Comment cannot be empty.",
                                minLength: { value: 2, message: "Too short." },
                                maxLength: { value: 500, message: "Max 500 characters." },
                            })} />
                        {(errors.content || error) && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.content?.message || error}</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={isSubmitting}
                        className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition">
                        <Send size={14} />
                        {isSubmitting ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>
        </div>
    )
}
