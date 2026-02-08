import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { axiosInstance } from "../lib/axios"

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const token = useSelector((state: RootState) => state.auth.token)

    useEffect(() => {
        if (token) {
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
        } else {
            delete axiosInstance.defaults.headers.common.Authorization
        }
    }, [token])

    return <>{children}</>
}

export default AuthProvider
