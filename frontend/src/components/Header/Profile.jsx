import { useState, useRef, useEffect } from "react";
import {
  UserCircle2,
  User,
  LayoutDashboard,
  Clock3,
  Heart,
  ListVideo,
  Settings,
  Moon,
  LogOut,
} from "lucide-react";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: User, label: "Profile" },
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Clock3, label: "Watch History" },
    { icon: Heart, label: "Liked Videos" },
    { icon: ListVideo, label: "Playlists" },
    { icon: Settings, label: "Settings" },
    { icon: Moon, label: "Switch Theme" },
    { icon: LogOut, label: "Logout" },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full transition hover:scale-105"
      >
        <UserCircle2
          size={40}
          className="text-zinc-700 dark:text-zinc-200"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-60
            z-40
            overflow-hidden
            rounded-xl
            border
            border-zinc-200
            bg-white
            shadow-xl
            dark:border-zinc-700
            dark:bg-zinc-900
          "
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  hover:bg-zinc-100
                  dark:hover:bg-zinc-800
                "
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}