import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api/axios.js";
import { Button } from "../components";

export function UploadTweet() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const [error, setError] = useState("");
    

    const onSubmit = async (data) => {
        setError("");

        try {
            console.log(data);
            

            const res = await api.post("/tweet/publish", data);
            console.log(res.data.data);
            

            reset();
            navigate("/tweet")

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
                        Upload Tweet
                    </h1>

                    <div />
                </div>

                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Publish your next amazing tweet to NexPlay.
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
                    

                    {/* DESCRIPTION */}

                    <div>
                        <label className="mb-2 block font-semibold">
                            Description
                        </label>

                        <textarea
                            rows={6}
                            placeholder="Write your video description..."
                            className="w-full rounded-xl border p-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                            {...register("content", {
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

                    

                    {/* BUTTON */}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3"
                    >
                        {isSubmitting
                            ? "Publishing..."
                            : "Publish Tweet"}
                    </Button>

                </form>

            </div>
        </div>
    );
}