import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { recipeService } from '../services/recipeService'
import { commentService } from '../services/commentService'
import { favoriteService } from '../services/favoriteService'

import { useAuth } from '../hooks/useAuth'
import { getImageUrl, getAvatarUrl } from '../utils/imageUrl'

import Loading from '../components/Loading'
import RecipeCard from '../components/RecipeCard'

const RecipeDetail = () => {
  const { slug } = useParams()

  const { user, isAuthenticated } = useAuth()

  const [recipe, setRecipe] = useState(null)
  const [comments, setComments] = useState([])
  const [similarRecipes, setSimilarRecipes] = useState([])

  const [newComment, setNewComment] = useState('')

  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)

  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    loadRecipe()
  }, [slug])

  const loadRecipe = async () => {
    try {
      setLoading(true)

      const recipeData = await recipeService.getRecipeBySlug(slug)

      setRecipe(recipeData)
      setIsFavorite(Boolean(recipeData.isFavorite))

      const [commentsData, latestData] = await Promise.all([
        commentService.getComments(slug),
        recipeService.getLatestRecipes(4)
      ])

      setComments(
        Array.isArray(commentsData)
          ? commentsData
          : commentsData.content || []
      )

      setSimilarRecipes(
        Array.isArray(latestData)
          ? latestData
          : latestData.content || []
      )
    } catch (error) {
      console.error('Erreur recette:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()

    if (!newComment.trim()) return

    try {
      setCommentLoading(true)

      const comment = await commentService.addComment(
        slug,
        newComment
      )

      setComments((prev) => [comment, ...prev])
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

      setIsFavorite((prev) => !prev)
    } catch (error) {
      console.error('Erreur favori:', error)
    }
  }

  if (loading) {
    return <Loading message="Chargement de la recette..." />
  }

  if (!recipe) {
    return (
      <div className="container py-5 text-center">
        <h2>Recette introuvable</h2>

        <Link to="/recipes" className="btn btn-success mt-3">
          Retour aux recettes
        </Link>
      </div>
    )
  }

  const averageRating = Number(recipe.averageRating || 0)
  const totalRatings = recipe.totalRatings || 0

  const ingredients = recipe.ingredients
    ? recipe.ingredients.split('\n')
    : []

  const instructions = recipe.instructions
    ? recipe.instructions.split('\n')
    : []

  return (
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-lg-8">
          <img
            src={getImageUrl(recipe.imageUrl)}
            alt={recipe.title}
            className="img-fluid rounded-4 shadow-lg mb-4 w-100"
            style={{
              maxHeight: '500px',
              objectFit: 'cover'
            }}
          />

          <h1 className="fw-bold mb-3">{recipe.title}</h1>

          <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
            <span className="badge bg-success">
              {recipe.categoryName || 'Catégorie'}
            </span>

            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`${
                    star <= Math.round(averageRating)
                      ? 'fas'
                      : 'far'
                  } fa-star ${
                    star <= Math.round(averageRating)
                      ? 'text-warning'
                      : 'text-muted'
                  }`}
                ></i>
              ))}

              <span className="ms-2 text-muted">
                ({totalRatings} avis)
              </span>
            </div>
          </div>

          <p className="lead">{recipe.description}</p>

          {isAuthenticated && (
            <button
              className={`btn mb-4 ${
                isFavorite
                  ? 'btn-success'
                  : 'btn-outline-success'
              }`}
              onClick={handleToggleFavorite}
            >
              <i
                className={`${
                  isFavorite ? 'fas' : 'far'
                } fa-heart me-2`}
              ></i>

              {isFavorite
                ? 'Retirer des favoris'
                : 'Ajouter aux favoris'}
            </button>
          )}

          <div className="card mb-5 border-0 shadow-sm">
            <div className="card-body">
              <h3 className="mb-4">Ingrédients</h3>

              <ul className="list-group list-group-flush">
                {ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="list-group-item"
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card mb-5 border-0 shadow-sm">
            <div className="card-body">
              <h3 className="mb-4">Préparation</h3>

              <ol className="ps-3">
                {instructions.map((step, index) => (
                  <li key={index} className="mb-3">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h3 className="mb-4">
                Commentaires ({comments.length})
              </h3>

              {isAuthenticated && (
                <form
                  onSubmit={handleAddComment}
                  className="mb-4"
                >
                  <textarea
                    className="form-control mb-3"
                    rows="3"
                    placeholder="Ajouter un commentaire..."
                    value={newComment}
                    onChange={(e) =>
                      setNewComment(e.target.value)
                    }
                  />

                  <button
                    className="btn btn-success"
                    disabled={
                      commentLoading ||
                      !newComment.trim()
                    }
                  >
                    Publier
                  </button>
                </form>
              )}

              {comments.length === 0 ? (
                <p className="text-muted">
                  Aucun commentaire.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-bottom pb-3 mb-3"
                  >
                    <div className="d-flex align-items-center mb-2">
                      <img
                        src={getAvatarUrl(
                          comment.authorAvatar
                        )}
                        alt="avatar"
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                      />

                      <div>
                        <h6 className="mb-0">
                          {comment.authorUsername ||
                            'Utilisateur'}
                        </h6>

                        <small className="text-muted">
                          {comment.createdAt
                            ? new Date(
                                comment.createdAt
                              ).toLocaleDateString('fr-FR')
                            : ''}
                        </small>
                      </div>
                    </div>

                    <p className="mb-0">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div
            className="sticky-top"
            style={{ top: '20px' }}
          >
            <h4 className="mb-4">
              Recettes similaires
            </h4>

            <div className="d-flex flex-column gap-4">
              {similarRecipes
                .filter((r) => r.slug !== recipe.slug)
                .slice(0, 4)
                .map((item) => (
                  <RecipeCard
                    key={item.id}
                    recipe={item}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail