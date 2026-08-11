import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { api } from "../api/axios.js"
import { Button } from "../components"
import { ArrowLeft } from "lucide-react"

export function UploadTweet() {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()
    const [error, setError] = useState("")
    const content = watch("content", "")

    const onSubmit = async (data) => {
        setError("")
        try {
            await api.post("/tweet/publish", { content: data.content })
            reset()
            navigate("/tweets")
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Something went wrong.")
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 py-10 px-4">
            <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl p-8">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-white">New Tweet</h1>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            What's on your mind?
                        </label>
                        <textarea
                            rows={6}
                            placeholder="Share something with the world..."
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white placeholder:text-zinc-500 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            {...register("content", {
                                required: "Content is required",
                                minLength: { value: 1, message: "Tweet cannot be empty" },
                                maxLength: { value: 500, message: "Max 500 characters" },
                            })}
                        />
                        <div className="mt-1 flex justify-between">
                            {errors.content ? (
                                <p className="text-sm text-red-400">{errors.content.message}</p>
                            ) : <span />}
                            <span className={`text-xs ${content.length > 450 ? "text-red-400" : "text-zinc-500"}`}>
                                {content.length}/500
                            </span>
                        </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
                        {isSubmitting ? "Posting..." : "Post Tweet"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
