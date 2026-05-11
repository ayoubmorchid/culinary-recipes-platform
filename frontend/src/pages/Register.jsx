import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loading from '../components/Loading'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  })

  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas!')
      return
    }

    const { role, ...registerData } = formData

    setLoading(true)

    const result = await register(registerData)

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
          <div className="col-xl-6 col-lg-7 col-md-9">
            <div className="luxury-auth-card">
              <div className="text-center mb-5">
                <div className="luxury-auth-icon">
                  <i className="fas fa-user-plus"></i>
                </div>

                <span className="luxury-mini-title">
                  Rejoignez-nous
                </span>

                <h2 className="luxury-auth-title">
                  Inscription
                </h2>

                <p className="luxury-auth-subtitle">
                  Créez votre compte Culinary Recipes
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-4">
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
                      placeholder="Votre pseudo"
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <label htmlFor="email" className="luxury-form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control luxury-input"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>
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
                    minLength="6"
                    placeholder="Minimum 6 caractères"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="luxury-form-label">
                    Confirmer le mot de passe
                  </label>

                  <input
                    type="password"
                    className="form-control luxury-input"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Répétez votre mot de passe"
                  />
                </div>

                <button
                  type="submit"
                  className="btn luxury-main-btn btn-lg w-100 mb-4"
                >
                  <i className="fas fa-user-plus me-2"></i>
                  S'inscrire
                </button>
              </form>

              <div className="text-center">
                <p className="luxury-auth-link-text mb-0">
                  Déjà inscrit ?{' '}
                  <Link to="/login" className="luxury-auth-link">
                    Connectez-vous
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

export default Register