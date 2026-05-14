import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { recipeService } from '../services/recipeService'
import { commentService } from '../services/commentService'
import { favoriteService } from '../services/favoriteService'
import { useAuth } from '../hooks/useAuth'
import Loading from '../components/Loading'
import RecipeCard from '../components/RecipeCard'
import { getImageUrl, getAvatarUrl } from '../utils/imageUrl.js'

const RecipeDetail = () => {
  const { slug } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [similarRecipes, setSimilarRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [avgRating, setAvgRating] = useState(0)

  useEffect(() => {
    loadRecipe()
  }, [slug])

  const loadRecipe = async () => {
    try {
      setLoading(true)
      const recipeData = await recipeService.getRecipeBySlug(slug)
      setRecipe(recipeData)
      setIsFavorite(recipeData.isFavorite || false)
      setAvgRating(recipeData.averageRating || 0)

      const [commentsData, similar] = await Promise.all([
        commentService.getComments(slug),
        recipeService.getLatestRecipes(4)
      ])
      setComments(Array.isArray(commentsData) ? commentsData : commentsData.content || [])
      setSimilarRecipes(similar.content || similar)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setCommentLoading(true)
    try {
      const commentData = await commentService.addComment(slug, newComment)
      setComments([commentData, ...comments])
      setNewComment('')
    } catch (error) {
      console.error('Erreur commentaire:', error)
    } finally {
      setCommentLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    try {
      await favoriteService.toggleFavorite(recipe.id)
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Erreur favori:', error)
    }
  }

  if (loading) return <Loading />

  if (!recipe) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-3x text-warning mb-4"></i>
          <h2>Recette non trouvée</h2>
          <Link to="/recipes" className="btn btn-success">Retour aux recettes</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      {/* Recipe Header */}
      <div className="row g-4 mb-5">
        <div className="col-lg-8">
          <img 
            src={getImageUrl(recipe.imageUrl, '/placeholder-recipe.jpg')}
            alt={recipe.title}
            className="recipe-detail-image img-fluid rounded-4 shadow-lg w-100"
          />
        </div>
        <div className="col-lg-4">
          <div className="sticky-top luxury-sticky-panel">
            <div className="card h-100 border-0 shadow">
              <div className="card-body">
                <h1 className="card-title h3 fw-bold mb-3">{recipe.title}</h1>
                <div className="mb-3">
                  <span className="badge bg-success fs-6 me-2">{recipe.categoryName || 'Categorie'}</span>
                  <span className="badge bg-light text-dark fs-6">
                    <i className="fas fa-eye me-1"></i>{recipe.viewCount || 0} vues
                  </span>
                </div>
                
                <div className="recipe-rating mb-4">
                  <div className="star-rating" aria-label={`Note ${Number(avgRating).toFixed(1)} sur 5`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= Math.round(Number(avgRating) || 0) ? 'star filled' : 'star'}
                        aria-hidden="true"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-count">
                    {Number(avgRating || 0).toFixed(1)} ({recipe.totalRatings || 0} avis)
                  </span>
                </div>

                {isAuthenticated && (
                  <button 
                    className={`btn w-100 mb-3 p-3 ${isFavorite ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={handleToggleFavorite}
                  >
                    <i className={`fas ${isFavorite ? 'fa-heart' : 'fa-heart-outline'} me-2`}></i>
                    {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </button>
                )}

                {recipe.authorUsername && (
                  <Link to={`/profile/${recipe.authorUsername}`} className="d-block text-decoration-none">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <img
                        src={getAvatarUrl(recipe.authorAvatar, '/default-avatar.png')}
                        alt="Auteur"
                        className="avatar-md me-3"
                      />
                      <div>
                        <h6 className="mb-0 fw-semibold">{recipe.authorUsername}</h6>
                        <small className="text-muted">Auteur</small>
                      </div>
                    </div>
                  </Link>
                )}

                {recipe.authorUsername === user?.username && (
                  <div className="mt-3">
                    <Link to={`/recipes/${slug}/edit`} className="btn btn-outline-primary me-2">
                      <i className="fas fa-edit"></i> Modifier
                    </Link>
                    <button className="btn btn-outline-danger">
                      <i className="fas fa-trash"></i> Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="row g-5">
        <div className="col-lg-8">
          <article>
            <div className="mb-5">
              <h2 className="h4 fw-bold mb-4">Description</h2>
              <p className="lead">{recipe.description}</p>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-list me-2"></i>Ingrédients
                    </h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled">
                      {recipe.ingredients.split('\\n').map((ingredient, index) => (
                        <li key={index} className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {ingredient.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-concierge-bell me-2"></i>Préparation
                    </h5>
                  </div>
                  <div className="card-body">
                    <ol className="list-decimal ps-4">
                      {recipe.instructions.split('\\n').map((step, index) => (
                        <li key={index} className="mb-3">
                          {step.trim()}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="card border-0 shadow">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-comments me-2 text-success"></i>
                  Commentaires ({comments.length})
                </h5>
              </div>
              <div className="card-body">
                {isAuthenticated && (
                  <form onSubmit={handleAddComment} className="mb-4 p-4 bg-light rounded-3">
                    <div className="row">
                      <div className="col-md-10">
                        <textarea
                          className="form-control"
                          rows="3"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Partagez votre avis sur cette recette..."
                        />
                      </div>
                      <div className="col-md-2 d-flex align-items-end">
                        <button className="btn btn-success w-100" disabled={commentLoading || !newComment.trim()}>
                          <i className="fas fa-paper-plane"></i> Envoyer
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="comments-list">
                  {comments.map((comment) => {
                    const authorUsername = comment.authorUsername || comment.author?.username || 'Utilisateur'
                    const authorAvatar = comment.authorAvatar || comment.author?.avatar

                    return (
                      <div key={comment.id} className="border-bottom pb-3 mb-3">
                        <div className="d-flex">
                          <img
                            src={getAvatarUrl(authorAvatar, '/default-avatar.png')}
                            alt="Auteur"
                            className="avatar-sm me-3"
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <h6 className="mb-1 fw-semibold">{authorUsername}</h6>
                              <small className="text-muted">{new Date(comment.createdAt).toLocaleDateString('fr-FR')}</small>
                            </div>
                            <p className="mb-0">{comment.content}</p>
                            {authorUsername === user?.username && (
                              <button className="btn btn-sm btn-outline-danger mt-2">
                                Supprimer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {comments.length === 0 && (
                    <p className="text-muted text-center py-4">Aucun commentaire pour le moment. Soyez le premier !</p>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="col-lg-4">
          <div className="sticky-top luxury-sticky-panel">
            <div className="card mb-4 border-0 shadow">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">
                  <i className="fas fa-sparkles me-2"></i>Recettes similaires
                </h6>
              </div>
              <div className="card-body p-0">
                {similarRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail

