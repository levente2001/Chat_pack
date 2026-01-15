import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Admin from './pages/Admin.jsx'
import Success from './pages/Success.jsx'
import Cancel from './pages/Cancel.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import RequireAdmin from './auth/RequireAdmin.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <Admin />
          </RequireAdmin>
        }
      />

      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
