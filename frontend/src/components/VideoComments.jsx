import { useEffect, useState } from "react";
import { api } from "../api/axios.js";

import { CommentCard } from "./Card/CommentCard.jsx";

export function VideoComment({ videoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!videoId) return;

    async function fetchComments() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/comment/${videoId}`);

        setComments(response.data.data.docs || []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        setError("Unable to load comments.");
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [videoId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-700 p-5">
        Loading comments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500 p-5 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">
        Comments ({comments.length})
      </h2>

      {comments.length === 0 ? (
        <div className="rounded-xl border border-zinc-700 p-5 text-center text-zinc-400">
          No comments yet.
        </div>
      ) : (
        comments.map((comment) => (
          <CommentCard
            key={comment._id}
            commentId={comment._id}
            owner={comment.owner}
            content={comment.content}
            createdAt={comment.createdAt}
          />
        ))
      )}
    </div>
  );
}