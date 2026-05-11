import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loading from '../components/Loading'

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(formData.username, formData.password)

    setLoading(false)

    if (result.success) {
      navigate('/')
    }
  }

  if (loading) return <Loading />

  return (
    <div className="luxury-auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-xl-5 col-lg-6 col-md-8">
            <div className="luxury-auth-card">
              <div className="text-center mb-5">
                <div className="luxury-auth-icon">
                  <i className="fas fa-sign-in-alt"></i>
                </div>

                <span className="luxury-mini-title">Bienvenue</span>

                <h2 className="luxury-auth-title">Connexion</h2>

                <p className="luxury-auth-subtitle">
                  Accédez à votre compte Culinary Recipes
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="luxury-form-label">
                    Nom d'utilisateur
                  </label>

                  <input
                    type="text"
                    className="form-control luxury-input"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom d'utilisateur"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="luxury-form-label">
                    Mot de passe
                  </label>

                  <input
                    type="password"
                    className="form-control luxury-input"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Votre mot de passe"
                  />
                </div>

                <button type="submit" className="btn luxury-main-btn btn-lg w-100 mb-4">
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Se connecter
                </button>
              </form>

              <div className="text-center">
                <p className="luxury-auth-link-text mb-0">
                  Pas de compte ?{' '}
                  <Link to="/register" className="luxury-auth-link">
                    Créez-en un
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login