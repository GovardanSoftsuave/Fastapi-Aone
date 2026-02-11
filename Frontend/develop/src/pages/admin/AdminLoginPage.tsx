import { useEffect, useCallback, useState, type SubmitEvent } from "react"
import { useNavigate } from "react-router-dom"

import { adminLogin, clearError } from "../../store/auth"
import { useAppDispatch, useAppSelector } from "../../store/hooks"

const AdminLoginPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { loading, error, token } = useAppSelector((state) => state.auth)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Redirect when authenticated
    useEffect(() => {
        if (token) {
             navigate("/") 
        }
        return () => {
            dispatch(clearError())
        }
    }, [token, navigate, dispatch])

    const handleSubmit = useCallback(
        async (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault()

            dispatch(clearError())
            // @ts-ignore
            await dispatch(adminLogin({ email, password })).unwrap()
        },
        [dispatch, email, password]
    )


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border bg-white px-8 py-10 shadow-sm text-center"
            >
                <h1 className="text-3xl font-semibold text-gray-900">Admin Login</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Restricted access. Please sign in.
                </p>

                {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="mt-4 h-12 w-full rounded-full border bg-gray-50 px-5 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="mt-4 h-12 w-full rounded-full border bg-gray-50 px-5 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 h-11 w-full rounded-full bg-indigo-600 text-white disabled:bg-gray-400"
                >
                    {loading ? "Signing in…" : "Login"}
                </button>
            </form>
        </div>
    )
}

export default AdminLoginPage
