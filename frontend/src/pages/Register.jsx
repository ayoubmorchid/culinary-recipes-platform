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
      setLoading(false)
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
    <div className="min-vh-100 d-flex align-items-center py-5" style={{backgroundColor: '#f8f9fa'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="logo mb-4">
                    <i className="fas fa-user-plus text-success fs-1"></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-1">Inscription</h2>
                  <p className="text-muted">Rejoignez la communauté Culinary Recipes</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label htmlFor="username" className="form-label fw-semibold">Nom d'utilisateur</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Votre pseudo"
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="email" className="form-label fw-semibold">Email</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
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
                    <label htmlFor="password" className="form-label fw-semibold">Mot de passe</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
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
                    <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Répétez votre mot de passe"
                    />
                  </div>

                  <button type="submit" className="btn btn-success btn-lg w-100 mb-3">
                    <i className="fas fa-user-plus me-2"></i>
                    S'inscrire
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Déjà inscrit ? <Link to="/login" className="text-success fw-semibold">Connectez-vous</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

