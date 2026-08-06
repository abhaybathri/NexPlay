import { NavLink } from "react-router-dom";

export default function CategoryTabs() {
  const tabs = [
    {
      name: "Videos",
      path: "/",
    },
    {
      name: "Tweets",
      path: "/tweets",
    },
  ];

  return (
    <div className="top-16 z-30 bg-white dark:bg-zinc-950 border-b dark:border-zinc-800">
      <div className="flex gap-4 px-6 py-3">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `rounded-full px-5 py-2 text-sm font-medium transition
              ${
                isActive
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}