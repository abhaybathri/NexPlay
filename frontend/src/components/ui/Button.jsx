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
        primary:
            "bg-blue-600 hover:bg-blue-700 w-full text-white",

        secondary:
            "bg-zinc-200 text-black hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",

        danger:
            "bg-red-600 hover:bg-red-700 text-white",

        ghost:
            "text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                w-full
                rounded-lg
                px-4
                whitespace-nowrap
                py-2.5
                font-medium
                transition
                disabled:cursor-not-allowed
                disabled:opacity-60
                ${variants[variant]}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
}