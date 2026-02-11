import { useCallback, useEffect, useState, type SubmitEvent } from "react"
import { Link, useNavigate } from "react-router-dom"

import { signup, clearError } from "../../store/auth"
import { useAppDispatch, useAppSelector } from "../../store/hooks"

type SignupForm = {
    name: string
    email: string
    password: string
}

const SignupPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { loading, error } = useAppSelector((state) => state.auth)

    const [form, setForm] = useState<SignupForm>({
        name: "",
        email: "",
        password: "",
    })

    // Cleanup error on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError())
        }
    }, [dispatch])

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target
            setForm((prev) => ({ ...prev, [name]: value }))
        },
        []
    )

    const handleSubmit = useCallback(
        async (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault()
            dispatch(clearError())

            await dispatch(signup(form)).unwrap()
            navigate("/login")
        },
        [dispatch, form, navigate]
    )

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border bg-white px-8 py-10 shadow-sm text-center"
            >
                <h1 className="text-3xl font-semibold text-gray-900">Sign up</h1>
                <p className="mt-2 text-sm text-gray-500">Create your account</p>

                {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <input
                    name="name"
                    placeholder="Name"
                    className="mt-6 h-12 w-full rounded-full border bg-gray-50 px-5 outline-none"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="mt-4 h-12 w-full rounded-full border bg-gray-50 px-5 outline-none"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="mt-4 h-12 w-full rounded-full border bg-gray-50 px-5 outline-none"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 h-11 w-full rounded-full bg-indigo-600 text-white disabled:bg-gray-400"
                >
                    {loading ? "Creating account…" : "Sign up"}
                </button>

                <p className="mt-4 text-sm text-gray-600">
                    Already have an account?
                    <Link to="/login" className="ml-1 text-indigo-600 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default SignupPage
