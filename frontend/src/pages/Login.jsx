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
    <div className="min-vh-100 d-flex align-items-center py-5" style={{backgroundColor: '#f8f9fa'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="logo mb-4">
                    <i className="fas fa-sign-in-alt text-success fs-1"></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-1">Connexion</h2>
                  <p className="text-muted">Accédez à votre compte Culinary Recipes</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-semibold">Nom d'utilisateur</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom d'utilisateur"
                    />
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
                      placeholder="Votre mot de passe"
                    />
                  </div>

                  <button type="submit" className="btn btn-success btn-lg w-100 mb-3">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Se connecter
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Pas de compte ? <Link to="/register" className="text-success fw-semibold">Créez-en un</Link>
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

export default Login

