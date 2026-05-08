import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import userService from '../services/userService'
import recipeService from '../services/recipeService'

import Loading from '../components/Loading'
import RecipeCard from '../components/RecipeCard'

import { getAvatarUrl } from '../utils/imageUrl'

const PublicProfile = () => {
  const { username } = useParams()

  const [profile, setProfile] = useState(null)
  const [recipes, setRecipes] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    try {
      setLoading(true)

      const profileData =
        await userService.getPublicProfile(username)

      setProfile(profileData)

      try {
        const recipesData =
          await recipeService.getRecipes(
            1,
            12,
            '',
            '',
            username
          )

        setRecipes(
          Array.isArray(recipesData)
            ? recipesData
            : recipesData.content || []
        )
      } catch (error) {
        console.error('Erreur recettes utilisateur:', error)
        setRecipes([])
      }
    } catch (error) {
      console.error('Erreur profil:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Chargement du profil..." />
  }

  if (!profile) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm p-5">
          <i className="fas fa-user-slash fa-3x text-muted mb-4"></i>

          <h2>Profil introuvable</h2>

          <p className="text-muted">
            Cet utilisateur n'existe pas.
          </p>

          <Link to="/recipes" className="btn btn-success mt-3">
            Voir les recettes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-lg mb-5 overflow-hidden">
        <div
          className="bg-success"
          style={{
            height: '180px'
          }}
        ></div>

        <div className="card-body text-center position-relative">
          <img
            src={getAvatarUrl(profile.avatar)}
            alt={profile.username}
            className="rounded-circle border border-4 border-white shadow"
            width="140"
            height="140"
            style={{
              objectFit: 'cover',
              marginTop: '-90px'
            }}
          />

          <h1 className="fw-bold mt-3">
            {profile.username}
          </h1>

          <p className="text-muted">
            {profile.email}
          </p>

          {profile.bio && (
            <p
              className="mx-auto mt-3"
              style={{
                maxWidth: '700px'
              }}
            >
              {profile.bio}
            </p>
          )}

          <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
            <div className="text-center">
              <h4 className="fw-bold mb-0">
                {recipes.length}
              </h4>

              <small className="text-muted">
                Recettes
              </small>
            </div>

            <div className="text-center">
              <h4 className="fw-bold mb-0">
                {profile.role || 'USER'}
              </h4>

              <small className="text-muted">
                Rôle
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h2 className="fw-bold mb-4">
          Recettes de {profile.username}
        </h2>

        {recipes.length === 0 ? (
          <div className="card border-0 shadow-sm p-5 text-center">
            <i className="fas fa-utensils fa-3x text-muted mb-4"></i>

            <h4>Aucune recette</h4>

            <p className="text-muted">
              Cet utilisateur n'a pas encore publié de recettes.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id || recipe.slug}
                className="col-lg-4 col-md-6"
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicProfile