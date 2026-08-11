import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { api } from "../api/axios.js"
import { login } from "../store/authSlice.js"
import { Input, Button } from "../components"
import { toast } from "react-toastify"
import { User, Lock, Image, Layers } from "lucide-react"

function ProfileForm({ userData, dispatch }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            fullname: userData?.fullname || "",
            email: userData?.email || ""
        }
    })

    async function onSubmit(data) {
        try {
            const res = await api.patch("/users/update-profile", data)
            dispatch(login({ userData: res.data.data }))
            toast.success("Profile updated!")
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Full Name"
                error={errors.fullname?.message}
                {...register("fullname", { required: "Full name is required" })}
            />
            <Input
                label="Email"
                type="email"
                error={errors.email?.message}
                {...register("email", { required: "Email is required" })}
            />
            <Button type="submit" disabled={isSubmitting} className="px-6">
                {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    )
}

function PasswordForm() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

    async function onSubmit(data) {
        try {
            await api.patch("/users/update-password", {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            })
            reset()
            toast.success("Password updated!")
        } catch (err) {
            toast.error(err.response?.data?.message || "Password update failed")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Current Password"
                type="password"
                error={errors.oldPassword?.message}
                {...register("oldPassword", { required: "Current password is required" })}
            />
            <Input
                label="New Password"
                type="password"
                error={errors.newPassword?.message}
                {...register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 8, message: "At least 8 characters" }
                })}
            />
            <Button type="submit" disabled={isSubmitting} className="px-6">
                {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
        </form>
    )
}

function AvatarForm({ dispatch }) {
    const [preview, setPreview] = useState(null)
    const { register, handleSubmit, formState: { isSubmitting } } = useForm()

    async function onSubmit(data) {
        const formData = new FormData()
        formData.append("avatar", data.avatar[0])
        try {
            const res = await api.patch("/users/update-avatar", formData)
            dispatch(login({ userData: res.data.data }))
            toast.success("Avatar updated!")
            setPreview(null)
        } catch (err) {
            toast.error(err.response?.data?.message || "Upload failed")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {preview && (
                <img src={preview} alt="preview" className="h-24 w-24 rounded-full object-cover border-2 border-blue-500" />
            )}
            <Input
                label="New Avatar"
                type="file"
                accept="image/*"
                {...register("avatar", {
                    required: "Please choose an image",
                    onChange: (e) => {
                        const file = e.target.files[0]
                        if (file) setPreview(URL.createObjectURL(file))
                    }
                })}
            />
            <Button type="submit" disabled={isSubmitting} className="px-6">
                {isSubmitting ? "Uploading..." : "Update Avatar"}
            </Button>
        </form>
    )
}

function CoverForm({ dispatch }) {
    const [preview, setPreview] = useState(null)
    const { register, handleSubmit, formState: { isSubmitting } } = useForm()

    async function onSubmit(data) {
        const formData = new FormData()
        formData.append("coverImage", data.coverImage[0])
        try {
            const res = await api.patch("/users/update-coverimage", formData)
            dispatch(login({ userData: res.data.data }))
            toast.success("Cover image updated!")
            setPreview(null)
        } catch (err) {
            toast.error(err.response?.data?.message || "Upload failed")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {preview && (
                <img src={preview} alt="preview" className="h-28 w-full rounded-xl object-cover border border-zinc-700" />
            )}
            <Input
                label="New Cover Image"
                type="file"
                accept="image/*"
                {...register("coverImage", {
                    required: "Please choose an image",
                    onChange: (e) => {
                        const file = e.target.files[0]
                        if (file) setPreview(URL.createObjectURL(file))
                    }
                })}
            />
            <Button type="submit" disabled={isSubmitting} className="px-6">
                {isSubmitting ? "Uploading..." : "Update Cover"}
            </Button>
        </form>
    )
}

const sections = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "password", icon: Lock, label: "Password" },
    { id: "avatar", icon: Image, label: "Avatar" },
    { id: "cover", icon: Layers, label: "Cover Image" },
]

export function Setting() {
    const [active, setActive] = useState("profile")
    const userData = useSelector(state => state.auth.userData)
    const authStatus = useSelector(state => state.auth.status)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setAuthChecked(true), 600)
        return () => clearTimeout(t)
    }, [])

    useEffect(() => {
        if (authChecked && !authStatus) navigate("/signin")
    }, [authChecked, authStatus, navigate])

    if (!authChecked || !userData) {
        return (
            <div className="flex justify-center py-24">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-500 dark:border-zinc-700" />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>
            <div className="flex flex-col sm:flex-row gap-6">
                {/* Sidebar */}
                <nav className="sm:w-48 shrink-0">
                    <ul className="space-y-1">
                        {sections.map(({ id, icon: Icon, label }) => (
                            <li key={id}>
                                <button
                                    onClick={() => setActive(id)}
                                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                        active === id
                                            ? "bg-blue-600 text-white"
                                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                    }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Content */}
                <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                    {active === "profile" && (
                        <>
                            <h2 className="text-lg font-semibold text-white mb-6">Edit Profile</h2>
                            <ProfileForm userData={userData} dispatch={dispatch} />
                        </>
                    )}
                    {active === "password" && (
                        <>
                            <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>
                            <PasswordForm />
                        </>
                    )}
                    {active === "avatar" && (
                        <>
                            <h2 className="text-lg font-semibold text-white mb-6">Update Avatar</h2>
                            {userData.avatar && (
                                <img src={userData.avatar} alt="current" className="h-20 w-20 rounded-full object-cover mb-4 border-2 border-zinc-700" />
                            )}
                            <AvatarForm dispatch={dispatch} />
                        </>
                    )}
                    {active === "cover" && (
                        <>
                            <h2 className="text-lg font-semibold text-white mb-6">Update Cover Image</h2>
                            {userData.coverImage && (
                                <img src={userData.coverImage} alt="current cover" className="h-28 w-full rounded-xl object-cover mb-4 border border-zinc-700" />
                            )}
                            <CoverForm dispatch={dispatch} />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Setting
