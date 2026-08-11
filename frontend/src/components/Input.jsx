import { forwardRef, useId } from "react"

const Input = forwardRef(function Input(
    { label, type = "text", error, className = "", ...props },
    ref
) {
    const id = useId()

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                ref={ref}
                type={type}
                className={`
                    w-full rounded-lg border px-4 py-2.5 text-sm
                    outline-none transition
                    border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                    dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500
                    file:mr-4 file:rounded-md file:border-0
                    file:bg-blue-600 file:px-3 file:py-1.5
                    file:text-sm file:text-white file:font-medium
                    hover:file:bg-blue-700
                    ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-600" : ""}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
            )}
        </div>
    )
})

export default Input
