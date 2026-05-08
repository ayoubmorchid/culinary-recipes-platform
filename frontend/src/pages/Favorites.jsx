import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { favoriteService } from '../services/favoriteService'
import { useAuth } from '../hooks/useAuth'

import RecipeCard from '../components/RecipeCard'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'

const Favorites = () => {
  const { isAuthenticated } = useAuth()

  const [favorites, setFavorites] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [page] = useState(1)

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    } else {
      setLoading(false)
    }
  }, [page, isAuthenticated])

  const loadFavorites = async () => {
    try {
      setLoading(true)

      const data = await favoriteService.getFavorites(page, 12)
      const list = Array.isArray(data) ? data : data.content || []

      setFavorites(list.map((item) => item.recipe || item))

      setPagination({
        currentPage: data.number + 1 || page,
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || list.length
      })
    } catch (error) {
      console.error('Erreur favoris:', error)
      setFavorites([])
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
          Connectez-vous pour voir vos recettes favorites.
        </p>
        <Link to="/login" className="btn btn-success btn-lg">
          Se connecter
        </Link>
      </div>
    )
  }

  if (loading) {
    return <Loading message="Chargement des favoris..." />
  }

  return (
    <div className="container py-5">
      <h1 className="h2 mb-5">
        <i className="fas fa-heart text-danger me-2"></i>
        Mes Favoris ({pagination.totalElements || 0})
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-5">
          <i className="far fa-heart fa-3x text-muted mb-4"></i>
          <h3 className="text-muted mb-3">Aucun favori</h3>
          <p className="text-muted">
            Ajoutez vos recettes préférées depuis la page Recettes.
          </p>
          <Link to="/recipes" className="btn btn-success">
            Découvrir des recettes
          </Link>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-5">
            {favorites.map((recipe) => (
              <div key={recipe.id || recipe.slug} className="col-xl-4 col-lg-6">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            basePath="/favorites"
          />
        </>
      )}
    </div>
  )
}

export default Favorites