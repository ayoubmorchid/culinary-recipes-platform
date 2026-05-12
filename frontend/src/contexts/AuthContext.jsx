import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

export const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  })

  //  INIT AUTH ON START
  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser)

        setUser(parsedUser)
        api.defaults.headers.common.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Auth init error:', error)

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common.Authorization
    } finally {
      setLoading(false)
    }
  }, [])

  // AUTO HIDE ALERT (FIX FOR "TREMBLING")
  useEffect(() => {
    if (!alert.show) return

    const timer = setTimeout(() => {
      setAlert({
        show: false,
        message: '',
        type: 'success'
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [alert.show])

  // 🔔 SHOW ALERT
  const showAlert = (message, type = 'success') => {
    setAlert({
      show: true,
      message,
      type
    })
  }

  // LOGIN
  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      })

      const { token, user: userData } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))

      api.defaults.headers.common.Authorization = `Bearer ${token}`
      setUser(userData)

      showAlert('Connexion réussie !', 'success')
      return { success: true }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Erreur de connexion'

      showAlert(message, 'danger')
      return { success: false, error: message }
    }
  }

  //REGISTER
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)

      const { token, user: newUser } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(newUser))

      api.defaults.headers.common.Authorization = `Bearer ${token}`
      setUser(newUser)

      showAlert('Inscription réussie !', 'success')
      return { success: true }
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur d'inscription"

      showAlert(message, 'danger')
      return { success: false, error: message }
    }
  }

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    delete api.defaults.headers.common.Authorization

    setUser(null)
    showAlert('Déconnexion réussie', 'info')
  }

  // UPDATE USER
  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const value = {
    user,
    loading,
    alert,
    setAlert,
    showAlert,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}