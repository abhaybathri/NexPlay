import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { api } from "../api/axios.js"
import { Button } from "../components"
import { ArrowLeft, Image, Video } from "lucide-react"

export function UploadVideo() {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm()
    const [error, setError] = useState("")
    const [thumbnailName, setThumbnailName] = useState("")
    const [videoName, setVideoName] = useState("")
    const [thumbnailPreview, setThumbnailPreview] = useState(null)

    const onSubmit = async (data) => {
        setError("")
        try {
            const formData = new FormData()
            formData.append("title", data.title.trim())
            formData.append("description", data.description.trim())
            formData.append("thumbnailFile", data.thumbnailFile[0])
            formData.append("videoFile", data.videoFile[0])

            await api.post("/video/publish", formData)
            reset()
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Upload failed. Please try again.")
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 py-10 px-4">
            <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl p-8">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Upload Video</h1>
                        <p className="text-sm text-zinc-500">Publish your content to NexPlay</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">Title</label>
                        <input
                            type="text"
                            placeholder="Enter a catchy video title"
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            {...register("title", {
                                required: "Title is required",
                                minLength: { value: 5, message: "At least 5 characters" },
                                maxLength: { value: 100, message: "Max 100 characters" },
                            })}
                        />
                        {errors.title && <p className="mt-1.5 text-sm text-red-400">{errors.title.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">Description</label>
                        <textarea
                            rows={5}
                            placeholder="Describe your video..."
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white placeholder:text-zinc-500 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            {...register("description", {
                                required: "Description is required",
                                minLength: { value: 20, message: "At least 20 characters" },
                            })}
                        />
                        {errors.description && <p className="mt-1.5 text-sm text-red-400">{errors.description.message}</p>}
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">Thumbnail</label>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 p-8 hover:border-blue-500 transition">
                            {thumbnailPreview ? (
                                <img src={thumbnailPreview} alt="preview" className="max-h-40 rounded-lg object-contain" />
                            ) : (
                                <div className="text-center">
                                    <Image size={36} className="mx-auto mb-3 text-zinc-500" />
                                    <p className="font-medium text-zinc-300">Click to choose thumbnail</p>
                                    <p className="text-sm text-zinc-500 mt-1">PNG • JPG • WEBP</p>
                                </div>
                            )}
                            {thumbnailName && !thumbnailPreview && (
                                <p className="mt-3 text-sm text-blue-400">{thumbnailName}</p>
                            )}
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                {...register("thumbnailFile", {
                                    required: "Thumbnail is required",
                                    onChange: (e) => {
                                        const file = e.target.files[0]
                                        setThumbnailName(file?.name || "")
                                        setThumbnailPreview(file ? URL.createObjectURL(file) : null)
                                    },
                                })}
                            />
                        </label>
                        {errors.thumbnailFile && <p className="mt-1.5 text-sm text-red-400">{errors.thumbnailFile.message}</p>}
                    </div>

                    {/* Video */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">Video File</label>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 p-8 hover:border-blue-500 transition">
                            <div className="text-center">
                                <Video size={36} className={`mx-auto mb-3 ${videoName ? "text-blue-400" : "text-zinc-500"}`} />
                                {videoName ? (
                                    <p className="font-medium text-blue-400">{videoName}</p>
                                ) : (
                                    <>
                                        <p className="font-medium text-zinc-300">Click to choose video</p>
                                        <p className="text-sm text-zinc-500 mt-1">MP4 • MOV • AVI • WEBM</p>
                                    </>
                                )}
                            </div>
                            <input
                                hidden
                                type="file"
                                accept="video/*"
                                {...register("videoFile", {
                                    required: "Video file is required",
                                    onChange: (e) => setVideoName(e.target.files[0]?.name || ""),
                                })}
                            />
                        </label>
                        {errors.videoFile && <p className="mt-1.5 text-sm text-red-400">{errors.videoFile.message}</p>}
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full py-3">
                        {isSubmitting ? "Uploading... this may take a moment" : "Publish Video"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
