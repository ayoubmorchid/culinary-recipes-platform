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
    if (searchTerm.trim()) navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg luxury-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand luxury-brand" to="/">
          ✦ Culinary Recipes
        </Link>

        <button className="navbar-toggler luxury-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto luxury-menu">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/recipes' ? 'active' : ''}`} to="/recipes">Recettes</Link>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/my-recipes">Mes Recettes</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/favorites">Favoris</Link></li>
              </>
            )}
          </ul>

          <form onSubmit={handleSearch} className="d-flex luxury-search me-3">
            <input
              className="form-control"
              type="search"
              placeholder="Rechercher une recette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn luxury-gold-btn" type="submit">🔍</button>
          </form>

          <ul className="navbar-nav">
            {!isAuthenticated ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Connexion</Link></li>
                <li className="nav-item"><Link className="btn luxury-outline-btn ms-lg-2" to="/register">Inscription</Link></li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  {user?.username || 'User'}
                </a>
                <ul className="dropdown-menu luxury-dropdown">
                  <li><Link className="dropdown-item" to="/profile">Mon Profil</Link></li>
                  {user?.role === 'ADMIN' && <li><Link className="dropdown-item" to="/admin">Admin</Link></li>}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Déconnexion</button></li>
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