import { useForm } from "react-hook-form";
import { Button, Input } from "../components";
import { api } from "../api/axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setError("");

        try {
            const response = await api.post("/users/login", data);

            const user = response.data.data;

            dispatch(
                authLogin({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    coverImage: user.coverImage
                })
            );

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Invalid email or password."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4 py-8">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-6 sm:p-8">

                <h1 className="text-3xl font-bold text-center text-zinc-900 dark:text-white">
                    Welcome Back
                </h1>

                <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Sign in to continue to NexPlay.
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
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message:
                                    "Password must be at least 8 characters",
                            },
                        })}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;