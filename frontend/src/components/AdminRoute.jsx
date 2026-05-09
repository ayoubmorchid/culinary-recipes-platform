import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const AdminRoute = ({ children }) => {
  const { isAdmin, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    )
  }

  return isAdmin ? children : <Navigate to="/" replace />
}

export default AdminRoute

