import { formatDistanceToNow } from "date-fns";

export function Description({ createdAt, content }) {
  const uploaded =
    createdAt &&
    formatDistanceToNow(new Date(createdAt), {
      addSuffix: true,
    });

  return (
    <div className="rounded-xl bg-zinc-900 p-5">
      <p className="mb-4 text-sm font-medium text-zinc-400">
        Uploaded {uploaded}
      </p>

      <p className="whitespace-pre-wrap break-words text-zinc-100">
        {content || "No description available."}
      </p>
    </div>
  );
}