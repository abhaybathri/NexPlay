import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function VideoCard({
  videoId,
  thumbnail,
  avatar,
  title,
  username,
  views,
  createdAt,
  duration,
}) {

  const uploaded = formatDistanceToNow(
    new Date(createdAt),
    { addSuffix: true }
  );

  function formatDuration(seconds) {
    seconds = Math.floor(seconds);

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  return (
    <Link
      to={`/watch/${videoId}`}
      className="group"
    >
      <div className="relative overflow-hidden rounded-xl">

        <img
          src={thumbnail}
          alt={title}
          className="aspect-video w-full rounded-xl object-cover transition group-hover:scale-105"
        />

        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
          {formatDuration(duration)}
        </span>

      </div>
      
      <div className="mt-3 flex gap-3">

        <img
          src={avatar}
          alt={username}
          className="h-10 w-10 rounded-full"
        />

        <div className="flex-1">

          <h3 className="line-clamp-2 font-medium">
            {title}
          </h3>

          <p className="text-sm text-zinc-500">
            {username}
          </p>

          <p className="text-sm text-zinc-500">
            {views} views • {uploaded}
          </p>

        </div>

      </div>
    </Link>
  );
}