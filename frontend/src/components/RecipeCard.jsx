import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { favoriteService } from '../services/favoriteService'
import { getImageUrl } from '../utils/imageUrl'

const RecipeCard = ({ recipe }) => {
  const { isAuthenticated } = useAuth()
  const [isFavorite, setIsFavorite] = React.useState(Boolean(recipe.isFavorite))
  const [loading, setLoading] = React.useState(false)

  const avgRating = Number(recipe.averageRating || 0)
  const totalRatings = recipe.totalRatings || 0
  const description = recipe.description || ''

  const toggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated || loading) return

    try {
      setLoading(true)
      await favoriteService.toggleFavorite(recipe.id)
      setIsFavorite((prev) => !prev)
    } catch (error) {
      console.error('Erreur favori:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card h-100 fade-in">
      <div className="position-relative">
        <Link to={`/recipes/${recipe.slug}`}>
          <img
            src={getImageUrl(recipe.imageUrl, '/placeholder-recipe.jpg')}
            alt={recipe.title}
            className="recipe-image card-img-top"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/placeholder-recipe.jpg'
            }}
          />
        </Link>

        {isAuthenticated && (
          <button
            type="button"
            className={`position-absolute top-0 end-0 m-2 btn btn-sm rounded-circle ${
              isFavorite ? 'btn-success' : 'btn-light'
            }`}
            onClick={toggleFavorite}
            disabled={loading}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
          </button>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <Link
          to={`/recipes/${recipe.slug}`}
          className="card-title h5 fw-bold text-dark text-decoration-none mb-2"
        >
          {recipe.title}
        </Link>

        <div className="mb-2">
          <span className="badge bg-success me-1">
            {recipe.categoryName || 'Catégorie'}
          </span>
        </div>

        <p className="card-text flex-grow-1 text-muted small">
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="d-flex align-items-center">
            <div className="star-rating me-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`${star <= Math.round(avgRating) ? 'fas' : 'far'} fa-star ${
                    star <= Math.round(avgRating) ? 'text-warning' : 'text-muted'
                  }`}
                ></i>
              ))}
            </div>

            <span className="text-muted small">({totalRatings})</span>
          </div>

          <Link to={`/recipes/${recipe.slug}`} className="btn btn-outline-success btn-sm">
            Voir recette
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard