import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { userService } from '../services/userService'
import Loading from '../components/Loading'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    bio: '',
    avatar: null
  })
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview

    if (profile?.avatar) {
      return profile.avatar.startsWith('http')
        ? profile.avatar
        : `${API_BASE_URL}${profile.avatar}`
    }

    return '/default-avatar.png'
  }

  const loadProfile = async () => {
    try {
      setError('')
      setLoading(true)

      const profileData = await userService.getMyProfile()

      setProfile(profileData)
      setFormData({
        bio: profileData.bio || '',
        avatar: null
      })
    } catch (error) {
      console.error('Erreur chargement profil:', error)

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Erreur lors du chargement du profil.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Veuillez choisir une image valide.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB.")
      return
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }

    setError('')
    setAvatarPreview(URL.createObjectURL(file))
    setFormData((prev) => ({
      ...prev,
      avatar: file
    }))
  }

  const handleEditToggle = () => {
    setEditing((prev) => !prev)

    if (editing) {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }

      setAvatarPreview(null)
      setFormData({
        bio: profile?.bio || '',
        avatar: null
      })
      setError('')
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUploadLoading(true)
    setError('')

    try {
      const updatedProfile = await userService.updateProfile(formData)

      setProfile(updatedProfile)

      if (typeof updateUser === 'function') {
        updateUser({ ...user, ...updatedProfile })
      }

      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }

      setEditing(false)
      setAvatarPreview(null)
      setFormData({
        bio: updatedProfile.bio || '',
        avatar: null
      })
    } catch (error) {
      console.error('Erreur mise à jour:', error)

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Erreur lors de la mise à jour du profil.'

      setError(message)
    } finally {
      setUploadLoading(false)
    }
  }

  if (loading) return <Loading message="Chargement du profil..." />

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-white border-0 pb-0">
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}

              <div className="d-flex align-items-center">
                <div className="position-relative">
                  <img
                    src={getAvatarUrl()}
                    alt="Avatar"
                    className="rounded-circle"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/default-avatar.png'
                    }}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover'
                    }}
                  />

                  {editing && (
                    <label
                      htmlFor="avatar-upload"
                      className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-2"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fas fa-camera fs-6 text-white"></i>

                      <input
                        id="avatar-upload"
                        type="file"
                        className="d-none"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>

                <div className="ms-4">
                  <h2 className="mb-1">{user?.username || user?.email}</h2>
                  <p className="text-muted mb-1">
                    {user?.role === 'ADMIN' ? 'Administrateur' : 'Membre'}
                  </p>
                  <span className="badge bg-success">
                    {profile?.recipeCount || 0} recettes publiées
                  </span>
                </div>
              </div>
            </div>

            <div className="card-body p-5">
              {editing ? (
                <form onSubmit={handleUpdate}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Biographie</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      name="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value
                        }))
                      }
                      placeholder="Racontez votre histoire culinaire..."
                    />
                  </div>

                  <div className="d-flex gap-3">
                    <button
                      type="submit"
                      className="btn btn-success flex-grow-1"
                      disabled={uploadLoading}
                    >
                      <i className="fas fa-save me-2"></i>
                      {uploadLoading ? 'Mise à jour...' : 'Enregistrer'}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleEditToggle}
                      disabled={uploadLoading}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-4">
                    <h5>
                      <i className="fas fa-info-circle me-2 text-muted"></i>
                      À propos
                    </h5>
                    <p className="text-muted">
                      {profile?.bio || 'Aucune biographie.'}
                    </p>
                  </div>

                  <div className="d-flex gap-3">
                    <button
                      className="btn btn-success"
                      onClick={handleEditToggle}
                    >
                      <i className="fas fa-edit me-2"></i>
                      Modifier profil
                    </button>

                    <Link to="/my-recipes" className="btn btn-outline-success">
                      <i className="fas fa-drumstick-bite me-2"></i>
                      Mes recettes
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile