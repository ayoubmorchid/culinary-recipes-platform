import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services/dashboardService'
import Loading from '../components/Loading'
import { useAuth } from '../hooks/useAuth'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const data = await dashboardService.getStats()
      setStats(data)
    } catch (error) {
      console.error('Erreur dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="container py-5">
      <div className="page-header">
        <h1 className="h2 mb-0">
          <i className="fas fa-tachometer-alt me-2 text-primary"></i>
          Tableau de bord Admin
        </h1>
        <Link to="/admin/users" className="btn btn-outline-primary">
          Gérer les utilisateurs
        </Link>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow h-100">
            <div className="card-body text-center">
              <i className="fas fa-users fa-3x text-primary mb-3"></i>
              <h3 className="card-title h2">{stats?.totalUsers || 0}</h3>
              <p className="text-muted mb-0">Utilisateurs</p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow h-100">
            <div className="card-body text-center">
              <i className="fas fa-drumstick-bite fa-3x text-success mb-3"></i>
              <h3 className="card-title h2">{stats?.totalRecipes || 0}</h3>
              <p className="text-muted mb-0">Recettes</p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow h-100">
            <div className="card-body text-center">
              <i className="fas fa-tag fa-3x text-info mb-3"></i>
              <h3 className="card-title h2">{stats?.totalCategories || 0}</h3>
              <p className="text-muted mb-0">Catégories</p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow h-100">
            <div className="card-body text-center">
              <i className="fas fa-comments fa-3x text-warning mb-3"></i>
              <h3 className="card-title h2">{stats?.totalComments || 0}</h3>
              <p className="text-muted mb-0">Commentaires</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card border-0 shadow mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-user-plus me-2"></i>
                Derniers utilisateurs
              </h5>
            </div>
            <div className="card-body p-0">
              {stats?.lastUsers?.map((user, index) => (
                <div key={user.id} className="border-bottom p-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <img src="/default-avatar.png" className="avatar-sm" alt={user.username} />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-0">{user.username}</h6>
                      <small className="text-muted">{new Date(user.dateJoined).toLocaleDateString()}</small>
                    </div>
                  </div>
                </div>
              )) || <p className="text-muted p-4 text-center">Aucun utilisateur récent</p>}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Dernières recettes
              </h5>
            </div>
            <div className="card-body p-0">
              {stats?.lastRecipes?.map((recipe, index) => (
                <div key={recipe.id} className="border-bottom p-3">
                  <div className="d-flex">
                    <img
                      src={recipe.imageUrl || '/placeholder-recipe.jpg'}
                      className="thumb-sm me-3"
                      alt={recipe.title}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{recipe.title}</h6>
                      <small className="text-muted">{recipe.categoryName}</small>
                    </div>
                  </div>
                </div>
              )) || <p className="text-muted p-4 text-center">Aucune recette récente</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
