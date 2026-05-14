import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { userService } from '../services/userService'
import { getAvatarUrl } from '../utils/imageUrl.js'

const PublicProfile = () => {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError('')
        setLoading(true)
        const data = await userService.getPublicProfile(username)
        setProfile(data)
      } catch (error) {
        console.error('Erreur chargement profil public:', error)
        setError('Profil introuvable.')
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      loadProfile()
    }
  }, [username])

  if (loading) return <Loading message={`Chargement du profil ${username}...`} />

  if (error || !profile) {
    return (
      <div className="container py-5">
        <div className="luxury-empty">
          <h2>Profil introuvable</h2>
          <p className="mb-4">Ce membre n'existe pas ou son profil n'est pas disponible.</p>
          <Link to="/recipes" className="btn luxury-main-btn">
            Retour aux recettes
          </Link>
        </div>
      </div>
    )
  }

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ')

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card luxury-simple-card">
            <div className="card-header p-4">
              <div className="d-flex align-items-center flex-column flex-md-row text-center text-md-start">
                <img
                  src={getAvatarUrl(profile.avatar, '/default-avatar.png')}
                  alt={profile.username}
                  className="profile-avatar"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = '/default-avatar.png'
                  }}
                />

                <div className="ms-md-4 mt-3 mt-md-0">
                  <span className="luxury-mini-title mb-2">Auteur</span>
                  <h1 className="h2 mb-1">{displayName || profile.username}</h1>
                  <p className="text-muted mb-2">@{profile.username}</p>
                  <span className="badge">
                    {profile.recipeCount || 0} recettes publiees
                  </span>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              <h5>A propos</h5>
              <p className="text-muted mb-4">
                {profile.bio || 'Aucune biographie pour le moment.'}
              </p>

              <div className="d-flex flex-column flex-md-row gap-3">
                <Link to="/recipes" className="btn luxury-main-btn">
                  Voir les recettes
                </Link>
                <Link to="/" className="btn luxury-secondary-btn">
                  Accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicProfile
