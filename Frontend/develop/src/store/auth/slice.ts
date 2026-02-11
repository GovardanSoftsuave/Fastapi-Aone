import { createSlice } from "@reduxjs/toolkit"
import type { AuthState } from "./types"
import { login, signup, checkAuth, adminLogin } from "./thunks"

const initialState: AuthState = {
    user: null, 
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    loading: false,
    error: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null
            state.user = null
            state.username = null
            state.error = null
            localStorage.removeItem("token")
            localStorage.removeItem("username")
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.access_token
                state.username = action.payload.username
                localStorage.setItem("token", action.payload.access_token)
                localStorage.setItem("username", action.payload.username)
                localStorage.setItem("role", action.payload.role)
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? "Login failed"
            })

            .addCase(adminLogin.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.access_token
                state.username = action.payload.username
                localStorage.setItem("token", action.payload.access_token)
                localStorage.setItem("username", action.payload.username)
                localStorage.setItem("role", action.payload.role)
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? "Admin Login failed"
            })

            .addCase(signup.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signup.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? "Signup failed"
            })

            .addCase(checkAuth.pending, (state) => {
                state.loading = true
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                state.username = action.payload.name
                state.error = null
                localStorage.setItem("username", action.payload.name)
                localStorage.setItem("role", action.payload.role)
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false
                state.user = null
                state.token = null
                state.username = null
                localStorage.removeItem("token")
                localStorage.removeItem("username")
            })
    },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
