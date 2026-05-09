import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

import Profile from './pages/Profile'
import PublicProfile from './pages/PublicProfile'

import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'

import CreateRecipe from './pages/CreateRecipe'
import EditRecipe from './pages/EditRecipe'

import Categories from './pages/Categories'
import Favorites from './pages/Favorites'
import Search from './pages/Search'
import MyRecipes from './pages/MyRecipes'

import AdminDashboard from './pages/AdminDashboard'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:slug" element={<RecipeDetail />} />

          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<Search />} />

          <Route
            path="/users/:username"
            element={<PublicProfile />}
          />

          {/* Protected */}
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

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App