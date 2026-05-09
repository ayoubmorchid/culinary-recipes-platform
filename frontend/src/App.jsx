import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import useAuth from './hooks/useAuth'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Alert from './components/Alert'
import Loading from './components/Loading'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import CreateRecipe from './pages/CreateRecipe'
import EditRecipe from './pages/EditRecipe'
import MyRecipes from './pages/MyRecipes'
import Favorites from './pages/Favorites'
import Search from './pages/Search'
import AdminDashboard from './pages/AdminDashboard'

import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

import './styles/global.css'

function AppContent() {
  const { alert, loading } = useAuth()

  if (loading) return <Loading message="Chargement..." />

  return (
    <div className="App min-vh-100 d-flex flex-column">
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:slug" element={<RecipeDetail />} />
          <Route path="/search" element={<Search />} />

          <Route
            path="/recipes/new"
            element={
              <PrivateRoute>
                <CreateRecipe />
              </PrivateRoute>
            }
          />

          <Route
            path="/recipes/:slug/edit"
            element={
              <PrivateRoute>
                <EditRecipe />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-recipes"
            element={
              <PrivateRoute>
                <MyRecipes />
              </PrivateRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {alert?.show && <Alert alert={alert} />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App