import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
    {
        label,
        type = "text",
        error,
        className = "",
        ...props
    },
    ref
) {
    const id = useId();

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                    {label}
                </label>
            )}

            <input
                id={id}
                ref={ref}
                type={type}
                className={`
                    w-full rounded-lg border
                    border-zinc-300 dark:border-zinc-700
                    bg-white dark:bg-zinc-900
                    text-zinc-900 dark:text-zinc-100
                    px-4 py-2.5
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                    file:mr-4
                    file:rounded-md
                    file:border-0
                    file:bg-blue-600
                    file:px-4
                    file:py-2
                    file:text-white
                    hover:file:bg-blue-700
                    ${className}
                `}
                {...props}
            />

            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
});

export default Input;