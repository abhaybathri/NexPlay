import { useState } from "react";
import { useForm } from "react-hook-form";

import { api } from "../api/axios.js";
import Button from "./ui/Button.jsx";

export function PostComment({ videoId }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [error, setError] = useState("");

  async function onSubmit(data) {
    setError("");

    try {
      await api.post(`/comment/${videoId}`, data);

      reset();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong."
      );
    }
  }

  return (
    <div className="rounded-xl border border-zinc-700 p-5">
      <h2 className="mb-4 text-lg font-semibold">
        Add a Comment
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <textarea
            rows={4}
            placeholder="Write your comment..."
            className="w-full resize-none rounded-xl border border-zinc-600 bg-transparent p-3 outline-none transition focus:border-blue-500"
            {...register("content", {
              required: "Comment is required.",
              minLength: {
                value: 2,
                message: "Comment must contain at least 2 characters.",
              },
              maxLength: {
                value: 500,
                message: "Comment cannot exceed 500 characters.",
              },
            })}
          />

          {errors.content && (
            <p className="mt-2 text-sm text-red-500">
              {errors.content.message}
            </p>
          )}

          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </div>
  );
}