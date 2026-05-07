import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()

    const value = searchTerm.trim()
    if (!value) return

    navigate(`/search?q=${encodeURIComponent(value)}`)
    setSearchTerm('')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) =>
    location.pathname === path ? 'active fw-semibold' : ''

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 text-success" to="/">
          Culinary Recipes
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Afficher le menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                Accueil
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive('/recipes')}`} to="/recipes">
                Recettes
              </Link>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/my-recipes')}`} to="/my-recipes">
                    Mes Recettes
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/favorites')}`} to="/favorites">
                    Favoris
                  </Link>
                </li>
              </>
            )}
          </ul>

          <form onSubmit={handleSearch} className="d-flex me-3">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button className="btn btn-outline-success" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>

          <ul className="navbar-nav">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/login')}`} to="/login">
                    Connexion
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/register')}`} to="/register">
                    Inscription
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-decoration-none"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user?.username || 'User'}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Mon Profil
                    </Link>
                  </li>

                  {user?.role === 'ADMIN' && (
                    <li>
                      <Link className="dropdown-item" to="/admin">
                        Admin
                      </Link>
                    </li>
                  )}

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Déconnexion
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar