import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosInstance } from "../lib/axios"

type LoginPayload = {
    email: string
    password: string
}

type SignupPayload = {
    name: string
    email: string
    password: string
}

interface AuthState {
    user: null
    token: string | null
    loading: boolean
    error: string | null
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
}

export const login = createAsyncThunk<
    { access_token: string },
    LoginPayload,
    { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/login", null, {
            params: { email, password },
        })
        return response.data
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.detail ?? "Login failed")
    }
})

export const signup = createAsyncThunk<
    void,
    SignupPayload,
    { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
    try {
        await axiosInstance.post("/signup", null, {
            params: payload,
        })
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.detail ?? "Signup failed")
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null
            state.user = null
            state.error = null
            localStorage.removeItem("token")
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
                localStorage.setItem("token", action.payload.access_token)
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? "Login failed"
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
    },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
