export default function Button({
    children,
    onClick,
    variant = "primary",
    type = "button",
    className = "",
    disabled = false,
    ...props
}) {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 dark:border-zinc-700",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        ghost: "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center justify-center
                rounded-lg px-4 py-2.5
                text-sm font-medium whitespace-nowrap
                transition
                disabled:cursor-not-allowed disabled:opacity-60
                ${variants[variant]}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    )
}
