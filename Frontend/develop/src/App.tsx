import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "./store/hooks"
import { checkAuth } from "./store/auth"

import LoginPage from "./pages/login/LoginPage"
import AdminLoginPage from "./pages/admin/AdminLoginPage"
import SignupPage from "./pages/signupPage.tsx/signupPage"
import HomePage from "./pages/HomePage/index"

import "./App.css"

function App() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => !!state.auth.token)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/admin/login"
          element={!isAuthenticated ? <AdminLoginPage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  )
}

export default App
