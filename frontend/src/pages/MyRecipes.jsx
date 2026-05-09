import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { recipeService } from '../services/recipeService'
import RecipeCard from '../components/RecipeCard'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'
import { useAuth } from '../hooks/useAuth'

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return
    loadMyRecipes()
  }, [page, isAuthenticated])

  const loadMyRecipes = async () => {
    try {
      setLoading(true)
      const data = await recipeService.getMyRecipes(page, 12)
      setRecipes(data.content || [])
      setPagination({
        currentPage: data.number + 1,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      })
    } catch (error) {
      console.error('Erreur mes recettes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="fas fa-lock fa-3x text-muted mb-4"></i>
          <h2>Connexion requise</h2>
          <p className="text-muted mb-4">Connectez-vous pour voir vos recettes</p>
          <Link to="/login" className="btn btn-success btn-lg">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  if (loading) return <Loading />

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="h2 mb-0">
          <i className="fas fa-drumstick-bite me-2 text-success"></i>
          Mes Recettes ({pagination.totalElements || 0})
        </h1>
        <Link to="/recipes/new" className="btn btn-success btn-lg">
          <i className="fas fa-plus me-2"></i>
          Nouvelle recette
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-drumstick-bite fa-3x text-muted mb-4"></i>
          <h3 className="text-muted mb-3">Aucune recette</h3>
          <p className="text-muted">Commencez par créer votre première recette</p>
          <Link to="/recipes/new" className="btn btn-success btn-lg">
            Créer ma première recette
          </Link>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-5">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="col-xl-4 col-lg-6">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/my-recipes"
            />
          )}
        </>
      )}
    </div>
  )
}

export default MyRecipes
