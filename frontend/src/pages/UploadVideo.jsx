import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api/axios.js";
import { Button } from "../components";

export function UploadVideo() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const [error, setError] = useState("");
    const [thumbnailName, setThumbnailName] = useState("");
    const [videoName, setVideoName] = useState("");

    const onSubmit = async (data) => {
        setError("");

        try {
            const formData = new FormData();

            formData.append("title", data.title.trim());
            formData.append("description", data.description.trim());
            formData.append("thumbnailFile", data.thumbnailFile[0]);
            formData.append("videoFile", data.videoFile[0]);

            const res = await api.post("/video/publish", formData);
            console.log(res);
            

            reset();

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong."
            );
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 py-10 px-4">
            <div className="mx-auto max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 shadow-xl p-8">

                {/* Header */}

                <div className="flex items-center justify-between mb-8">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        ← Back
                    </button>

                    <h1 className="text-3xl font-bold">
                        Upload Video
                    </h1>

                    <div />
                </div>

                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Publish your next amazing video to NexPlay.
                </p>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-600">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-7"
                >
                    {/* TITLE */}

                    <div>
                        <label className="mb-2 block font-semibold">
                            Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter video title"
                            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("title", {
                                required: "Title is required",
                                minLength: {
                                    value: 5,
                                    message:
                                        "Title should be at least 5 characters",
                                },
                                maxLength: {
                                    value: 100,
                                    message:
                                        "Maximum 100 characters allowed",
                                },
                            })}
                        />

                        {errors.title && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* DESCRIPTION */}

                    <div>
                        <label className="mb-2 block font-semibold">
                            Description
                        </label>

                        <textarea
                            rows={6}
                            placeholder="Write your video description..."
                            className="w-full rounded-xl border p-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                            {...register("description", {
                                required: "Description is required",
                                minLength: {
                                    value: 20,
                                    message:
                                        "Description should be at least 20 characters",
                                },
                            })}
                        />

                        {errors.description && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* THUMBNAIL */}

                    <div>

                        <label className="mb-2 block font-semibold">
                            Thumbnail
                        </label>

                        <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 hover:border-blue-500 transition">

                            <div className="text-center">

                                <p className="text-4xl">
                                    🖼️
                                </p>

                                <p className="mt-3 font-semibold">
                                    Click to choose thumbnail
                                </p>

                                <p className="text-sm text-gray-500">
                                    PNG • JPG • WEBP
                                </p>

                                {thumbnailName && (
                                    <p className="mt-4 text-blue-600 font-medium">
                                        {thumbnailName}
                                    </p>
                                )}

                            </div>

                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                {...register("thumbnailFile", {
                                    required:
                                        "Thumbnail is required",
                                    onChange: (e) =>
                                        setThumbnailName(
                                            e.target.files[0]?.name || ""
                                        ),
                                })}
                            />

                        </label>

                        {errors.thumbnailFile && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.thumbnailFile.message}
                            </p>
                        )}

                    </div>

                    {/* VIDEO */}

                    <div>

                        <label className="mb-2 block font-semibold">
                            Video
                        </label>

                        <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 hover:border-blue-500 transition">

                            <div className="text-center">

                                <p className="text-4xl">
                                    🎥
                                </p>

                                <p className="mt-3 font-semibold">
                                    Click to choose video
                                </p>

                                <p className="text-sm text-gray-500">
                                    MP4 • MOV • AVI
                                </p>

                                {videoName && (
                                    <p className="mt-4 text-blue-600 font-medium">
                                        {videoName}
                                    </p>
                                )}

                            </div>

                            <input
                                hidden
                                type="file"
                                accept="video/*"
                                {...register("videoFile", {
                                    required:
                                        "Video is required",
                                    onChange: (e) =>
                                        setVideoName(
                                            e.target.files[0]?.name || ""
                                        ),
                                })}
                            />

                        </label>

                        {errors.videoFile && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.videoFile.message}
                            </p>
                        )}

                    </div>

                    {/* BUTTON */}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3"
                    >
                        {isSubmitting
                            ? "Publishing..."
                            : "Publish Video"}
                    </Button>

                </form>

            </div>
        </div>
    );
}