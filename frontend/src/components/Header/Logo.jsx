import { Link } from "react-router-dom";
import { Play } from "lucide-react";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 shrink-0"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
        <Play size={20} fill="white" />
      </div>

      <div className="hidden sm:block">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
          NexPlay
        </h1>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Share. Watch. Connect.
        </p>
      </div>
    </Link>
  );
}