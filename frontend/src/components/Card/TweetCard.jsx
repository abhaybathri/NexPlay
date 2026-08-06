import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { api } from "../../api/axios"; // change path if needed

export default function TweetCard({
    tweetId,
    content,
    user,
    uploadedAt,
    initialLikes,
    initiallyLiked = false
}) {
    const [expanded, setExpanded] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initiallyLiked);
    const [loading, setLoading] = useState(false);

    const uploaded = formatDistanceToNow(new Date(uploadedAt), {
        addSuffix: true,
    });

    async function toggleLike() {
        if (loading) return;

        setLoading(true);

        try {
            const res = await api.post(`/like/toggle/t/${tweetId}`);
            console.log((res));
            

            if (liked) {
                setLikes((prev) => Math.max(prev - 1, 0));
            } else {
                setLikes((prev) => prev + 1);
            }

            setLiked((prev) => !prev);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const longTweet = content.length > 180;

    return (
        <div className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-md transition hover:border-zinc-500">
            {/* Header */}
            <div className="flex items-center gap-3">
                <img
                    src={user?.avatar}
                    alt={user?.username}
                    className="h-11 w-11 rounded-full object-cover"
                />

                <div className="flex flex-col">
                    <p className="font-semibold text-white">
                        {user?.username}
                    </p>

                    <p className="text-xs text-zinc-400">
                        {uploaded}
                    </p>
                </div>
            </div>

            {/* Tweet */}
            <div className="mt-4">
                <p
                    className={`text-zinc-200 whitespace-pre-wrap break-words ${
                        expanded ? "" : "line-clamp-4"
                    }`}
                >
                    {content}
                </p>

                {longTweet && (
                    <button
                        onClick={() => setExpanded((prev) => !prev)}
                        className="mt-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                        {expanded ? "Show less" : "Read more"}
                    </button>
                )}
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between border-t border-zinc-700 pt-4">
                <button
                    onClick={toggleLike}
                    disabled={loading}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        liked
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-zinc-600 text-zinc-200 hover:border-white"
                    }`}
                >
                    ❤️ {likes} {likes === 1 ? "Like" : "Likes"}
                </button>
            </div>
        </div>
    );
}