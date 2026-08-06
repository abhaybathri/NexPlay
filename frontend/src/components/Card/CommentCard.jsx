import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { api } from "../../api/axios";

export function CommentCard({
  content,
  createdAt,
  owner,
  commentId,
  initialLikes = 0,
  initialLiked = false,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (loading || !commentId) return;

    setLoading(true);

    try {
      await api.post(`/like/toggle/c/${commentId}`);

      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    } catch (error) {
      console.error("Failed to toggle comment like:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-700 p-4">
      <div className="flex items-start gap-4">
        <img
          src={owner?.avatar}
          alt={owner?.username}
          className="h-10 w-10 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">
              {owner?.username}
            </h3>

            <span className="text-sm text-zinc-400">
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <p className="mt-2 whitespace-pre-wrap break-words text-zinc-200">
            {content}
          </p>

          <button
            onClick={toggleLike}
            disabled={loading}
            className={`mt-4 rounded-full border px-4 py-1 text-sm transition ${
              liked
                ? "border-red-500 bg-red-500 text-white"
                : "border-zinc-600 hover:border-white"
            } ${
              loading ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            ❤️ {likes}
          </button>
        </div>
      </div>
    </div>
  );
}