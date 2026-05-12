import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { favoriteService } from '../services/favoriteService'
import { getImageUrl } from '../utils/imageUrl.js'

const RecipeCard = ({ recipe }) => {
  const { isAuthenticated } = useAuth()

  const [isFavorite, setIsFavorite] = React.useState(recipe?.isFavorite || false)
  const [loading, setLoading] = React.useState(false)

  const toggleFavorite = async () => {
    if (!isAuthenticated) return

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

  const ratingValue =
    recipe?.averageRating ??
    recipe?.avgRating ??
    recipe?.rating ??
    recipe?.note ??
    recipe?.score ??
    recipe?.stars ??
    0

  const avgRating = Number(ratingValue) || 0

  const totalRatings =
    recipe?.totalRatings ??
    recipe?.ratingCount ??
    recipe?.reviewsCount ??
    recipe?.reviewCount ??
    recipe?.avisCount ??
    recipe?.numberOfRatings ??
    recipe?.ratingsCount ??
    0

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
            className={`position-absolute top-0 end-0 m-2 btn btn-sm p-2 rounded-circle ${
              isFavorite ? 'btn-success' : 'btn-outline-light'
            }`}
            onClick={toggleFavorite}
            disabled={loading}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <i
              className={`fa-heart fs-6 ${
                isFavorite ? 'fas text-white' : 'far text-success'
              }`}
            ></i>
          </button>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <Link
          to={`/recipes/${recipe?.slug}`}
          className="card-title h5 fw-bold text-dark text-decoration-none mb-2"
        >
          {recipe?.title}
        </Link>

        <div className="mb-2">
          <span className="badge bg-success me-1">
            {recipe?.categoryName || 'Catégorie'}
          </span>
        </div>

        <p className="card-text text-muted small flex-grow-1">
          {recipe?.description
            ? recipe.description.length > 100
              ? `${recipe.description.substring(0, 100)}...`
              : recipe.description
            : 'Aucune description disponible.'}
        </p>

        <div className="recipe-card-footer d-flex justify-content-between align-items-center mt-auto">
          <div className="d-flex align-items-center">
            <div className="star-rating me-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    color: star <= Math.round(avgRating) ? '#ffc107' : '#d6d6d6',
                    fontSize: '18px',
                    lineHeight: '1',
                    marginRight: '2px'
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <span className="text-muted small">
              {avgRating.toFixed(1)} ({totalRatings} avis)
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