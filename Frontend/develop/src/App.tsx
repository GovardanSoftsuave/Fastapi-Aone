import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAppSelector } from "./store/hooks"

import LoginPage from "./pages/login/LoginPage"
import SignupPage from "./pages/signupPage.tsx/signupPage"
import HomePage from "./pages/HomePage/index"

import "./App.css"

function App() {
  const isAuthenticated = useAppSelector((state) => !!state.auth.token)

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
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
