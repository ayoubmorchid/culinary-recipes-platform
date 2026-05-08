import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { recipeService } from '../services/recipeService'
import { useAuth } from '../hooks/useAuth'

import RecipeCard from '../components/RecipeCard'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'

const MyRecipes = () => {
  const { isAuthenticated } = useAuth()

  const [recipes, setRecipes] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [page] = useState(1)

  useEffect(() => {
    if (isAuthenticated) {
      loadMyRecipes()
    } else {
      setLoading(false)
    }
  }, [page, isAuthenticated])

  const loadMyRecipes = async () => {
    try {
      setLoading(true)

      const data = await recipeService.getMyRecipes(page, 12)
      const list = Array.isArray(data) ? data : data.content || []

      setRecipes(list)

      setPagination({
        currentPage: data.number + 1 || page,
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || list.length
      })
    } catch (error) {
      console.error('Erreur mes recettes:', error)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <i className="fas fa-lock fa-3x text-muted mb-4"></i>
        <h2>Connexion requise</h2>
        <p className="text-muted mb-4">
          Connectez-vous pour voir vos recettes.
        </p>
        <Link to="/login" className="btn btn-success btn-lg">
          Se connecter
        </Link>
      </div>
    )
  }

  if (loading) {
    return <Loading message="Chargement de vos recettes..." />
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
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
          <p className="text-muted">
            Commencez par créer votre première recette.
          </p>

          <Link to="/recipes/new" className="btn btn-success btn-lg">
            Créer ma première recette
          </Link>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-5">
            {recipes.map((recipe) => (
              <div key={recipe.id || recipe.slug} className="col-xl-4 col-lg-6">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            basePath="/my-recipes"
          />
        </>
      )}
    </div>
  )
}

export default MyRecipes