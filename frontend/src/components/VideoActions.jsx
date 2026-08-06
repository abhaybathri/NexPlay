import { useState } from "react";
import { api } from "../api/axios";

export function VideoActions({
  title,
  initialLikes = 0,
  initialLiked = false,
  videoId,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (loading || !videoId) return;

    setLoading(true);

    try {
      await api.post(`/like/toggle/v/${videoId}`);

      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setLoading(false);
    }
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Video link copied to clipboard.");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold break-words">{title}</h1>

      <div className="flex items-center justify-start gap-5 border-t border-zinc-700 pt-4">
        <button
          onClick={toggleLike}
          disabled={loading}
          className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
            liked
              ? "border-red-500 bg-red-500 text-white"
              : "border-zinc-600 text-zinc-200 hover:border-white hover:bg-zinc-800"
          } ${
            loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          ❤️ {likes} {likes === 1 ? "Like" : "Likes"}
        </button>

        <button
          onClick={share}
          className="rounded-full border border-zinc-600 px-5 py-2 text-sm font-medium text-zinc-200 transition-all duration-200 hover:border-white hover:bg-zinc-800"
        >
          Share
        </button>
      </div>
    </div>
  );
}