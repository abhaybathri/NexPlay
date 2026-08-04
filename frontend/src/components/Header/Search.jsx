import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div className="hidden sm:flex flex-1 max-w-xl mx-6">
      <div className="flex w-full h-10">

        <input
          type="text"
          placeholder="Search"
          className="
            flex-1
            px-4
            rounded-l-full
            border
            border-zinc-300
            bg-white
            text-black
            placeholder:text-zinc-500
            outline-none
            focus:border-blue-500

            dark:bg-zinc-900
            dark:text-white
            dark:border-zinc-700
            dark:placeholder:text-zinc-400
          "
        />

        <button
          className="
            px-6
            border
            border-l-0
            border-zinc-300
            rounded-r-full
            bg-zinc-100
            hover:bg-zinc-200
            transition

            dark:bg-zinc-800
            dark:border-zinc-700
            dark:hover:bg-zinc-700
          "
        >
          <SearchIcon
            size={20}
            className="text-zinc-700 dark:text-zinc-200"
          />
        </button>

      </div>
    </div>
  );
}