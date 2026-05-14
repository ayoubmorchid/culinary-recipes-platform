import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { favoriteService } from '../services/favoriteService'
import { getImageUrl } from '../utils/imageUrl.js'

const RecipeCard = ({ recipe }) => {
  const { isAuthenticated } = useAuth()

  const [isFavorite, setIsFavorite] = React.useState(recipe?.isFavorite || false)
  const [loading, setLoading] = React.useState(false)

  const averageRating = Number(recipe?.averageRating ?? 0)
  const totalRatings = Number(recipe?.totalRatings ?? 0)
  const roundedRating = Math.round(averageRating)

  const toggleFavorite = async () => {
    if (!isAuthenticated || !recipe?.id) return

    setLoading(true)
    try {
      await favoriteService.toggleFavorite(recipe.id)
      setIsFavorite((prev) => !prev)
    } catch (error) {
      console.error('Erreur favori:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card recipe-card fade-in">
      <div className="recipe-image-wrapper position-relative">
        <img
          src={getImageUrl(recipe?.imageUrl, '/placeholder-recipe.jpg')}
          alt={recipe?.title || 'Recipe'}
          className="recipe-image card-img-top"
        />

        {isAuthenticated && (
          <button
            type="button"
            className={`favorite-btn position-absolute top-0 end-0 m-2 btn btn-sm p-2 rounded-circle ${
              isFavorite ? 'btn-success' : 'btn-outline-light'
            }`}
            onClick={toggleFavorite}
            disabled={loading}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
            <span className="visually-hidden">
              {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </span>
          </button>
        )}
      </div>

      <div className="card-body">
        <Link
          to={`/recipes/${recipe?.slug}`}
          className="card-title h5 fw-bold text-decoration-none mb-2"
        >
          {recipe?.title}
        </Link>

        <div className="mb-2">
          <span className="badge bg-success me-1">
            {recipe?.categoryName || 'Categorie'}
          </span>
        </div>

        <p className="card-text text-muted small">
          {recipe?.description
            ? recipe.description.length > 100
              ? `${recipe.description.substring(0, 100)}...`
              : recipe.description
            : 'Aucune description disponible.'}
        </p>

        <div className="recipe-card-footer">
          <div className="recipe-rating">
            <div className="star-rating" aria-label={`Note ${averageRating.toFixed(1)} sur 5`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= roundedRating ? 'star filled' : 'star'}
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
            </div>

            <span className="rating-count">
              {averageRating.toFixed(1)} ({totalRatings} avis)
            </span>
          </div>

          <Link
            to={`/recipes/${recipe?.slug}`}
            className="btn btn-outline-success btn-sm"
          >
            Voir recette
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard
