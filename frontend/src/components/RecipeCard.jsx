import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { favoriteService } from '../services/favoriteService'
import { getImageUrl } from '../utils/imageUrl.js'

const RecipeCard = ({ recipe }) => {
  const { user, isAuthenticated } = useAuth()
  const [isFavorite, setIsFavorite] = React.useState(recipe.isFavorite || false)
  const [loading, setLoading] = React.useState(false)

  const toggleFavorite = async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      await favoriteService.toggleFavorite(recipe.id)
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Erreur favori:', error)
    } finally {
      setLoading(false)
    }
  }

  const avgRating = Number(recipe.averageRating || 0)

  return (
    <div className="card h-100 fade-in">
      <div className="position-relative">
        <img src={getImageUrl(recipe.imageUrl, '/placeholder-recipe.jpg')} 
             alt={recipe.title} 
             className="recipe-image card-img-top" />
        {isAuthenticated && (
          <button 
            className={`position-absolute top-2 end-2 btn btn-sm p-2 rounded-circle ${isFavorite ? 'btn-success' : 'btn-outline-light'}`}
            onClick={toggleFavorite}
            disabled={loading}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <i className={`far fa-heart fs-6 ${isFavorite ? 'text-success' : ''}`}></i>
          </button>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <Link to={`/recipes/${recipe.slug}`} className="card-title h5 fw-bold text-dark text-decoration-none mb-2">
          {recipe.title}
        </Link>
        
        <div className="mb-2">
          <span className="badge bg-success me-1">{recipe.categoryName || 'Catégorie'}</span>
        </div>
        
        <p className="card-text flex-grow-1 text-muted small">{recipe.description?.substring(0, 100)}...</p>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="d-flex align-items-center">
            <div className="star-rating me-2">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star ${i < Math.round(avgRating) ? 'text-warning' : 'far fa-star text-muted'}`}></i>
              ))}
            </div>
            <span className="text-muted small">({recipe.totalRatings || 0})</span>
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
