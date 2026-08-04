import { useForm } from "react-hook-form";
import { Button, Input } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api/axios.js";

export function Signup() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const navigate = useNavigate();
    const [error, setError] = useState("");

    const onSubmit = async (data) => {
        setError("");

        try {
            const formData = new FormData();

            formData.append("fullname", data.fullname.trim());
            formData.append("username", data.username.trim());
            formData.append("email", data.email.trim());
            formData.append("password", data.password);

            formData.append("avatar", data.avatar[0]);

            if (data.coverImage?.length) {
                formData.append("coverImage", data.coverImage[0]);
            }
            console.log(formData);
            

            const response = await api.post("/users/register", formData);

            reset();
            navigate("/signin");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create account. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4 py-8">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-6 sm:p-8">

                <h1 className="text-3xl font-bold text-center text-zinc-900 dark:text-white">
                    Create Account
                </h1>

                <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Join NexPlay and start sharing your content.
                </p>

                {error && (
                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 space-y-5"
                >
                    <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        error={errors.fullname?.message}
                        {...register("fullname", {
                            required: "Full name is required",
                            minLength: {
                                value: 3,
                                message: "Minimum 3 characters",
                            },
                        })}
                    />

                    <Input
                        label="Username"
                        placeholder="Enter username"
                        autoComplete="username"
                        error={errors.username?.message}
                        {...register("username", {
                            required: "Username is required",
                            pattern: {
                                value: /^[a-zA-Z0-9_]+$/,
                                message:
                                    "Only letters, numbers and underscores are allowed",
                            },
                        })}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Please enter a valid email",
                            },
                        })}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        autoComplete="new-password"
                        error={errors.password?.message}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                            },
                        })}
                    />

                    <Input
                        label="Avatar"
                        type="file"
                        accept="image/*"
                        error={errors.avatar?.message}
                        {...register("avatar", {
                            required: "Avatar is required",
                        })}
                    />

                    <Input
                        label="Cover Image (Optional)"
                        type="file"
                        accept="image/*"
                        error={errors.coverImage?.message}
                        {...register("coverImage")}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Already have an account?{" "}
                    <Link
                        to="/signin"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;