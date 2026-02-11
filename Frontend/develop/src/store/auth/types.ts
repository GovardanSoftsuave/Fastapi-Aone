export type LoginPayload = {
    email: string
    password: string
}

export type SignupPayload = {
    name: string
    email: string
    password: string
}

export interface AuthState {
    user: { id: number; email: string; name: string; role: string } | null
    token: string | null
    username: string | null
    loading: boolean
    error: string | null
}
