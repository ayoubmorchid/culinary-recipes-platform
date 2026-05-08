import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { userService } from '../services/userService'

import Loading from '../components/Loading'

import { getAvatarUrl } from '../utils/imageUrl'

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

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const profileData = await userService.getMyProfile()

      setProfile(profileData)

      setFormData({
        bio: profileData.bio || '',
        avatar: null
      })
    } catch (error) {
      console.error('Erreur profil:', error)

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
    if (editing && avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }

    setEditing((prev) => !prev)

    setAvatarPreview(null)

    setFormData({
      bio: profile?.bio || '',
      avatar: null
    })

    setError('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      setUploadLoading(true)
      setError('')

      const updatedProfile =
        await userService.updateProfile(formData)

      setProfile(updatedProfile)

      if (typeof updateUser === 'function') {
        updateUser({
          ...user,
          ...updatedProfile
        })
      }

      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }

      setAvatarPreview(null)

      setEditing(false)

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

  if (loading) {
    return <Loading message="Chargement du profil..." />
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 overflow-hidden">
            <div
              className="bg-success"
              style={{
                height: '180px'
              }}
            ></div>

            <div className="card-body p-5 position-relative">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <div className="text-center mb-5">
                <div className="position-relative d-inline-block">
                  <img
                    src={
                      avatarPreview ||
                      getAvatarUrl(profile?.avatar)
                    }
                    alt="Avatar"
                    className="rounded-circle border border-4 border-white shadow"
                    style={{
                      width: '140px',
                      height: '140px',
                      objectFit: 'cover',
                      marginTop: '-120px'
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src =
                        '/default-avatar.png'
                    }}
                  />

                  {editing && (
                    <label
                      htmlFor="avatar-upload"
                      className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2 border border-white"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fas fa-camera text-white"></i>

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

                <h2 className="fw-bold mt-4">
                  {user?.username || 'Utilisateur'}
                </h2>

                <p className="text-muted">
                  {user?.role === 'ADMIN'
                    ? 'Administrateur'
                    : 'Membre'}
                </p>

                <span className="badge bg-success">
                  {profile?.recipeCount || 0} recettes
                </span>
              </div>

              {editing ? (
                <form onSubmit={handleUpdate}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Biographie
                    </label>

                    <textarea
                      className="form-control"
                      rows="5"
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

                      {uploadLoading
                        ? 'Enregistrement...'
                        : 'Enregistrer'}
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
                  <div className="mb-5">
                    <h5 className="fw-bold mb-3">
                      À propos
                    </h5>

                    <p className="text-muted">
                      {profile?.bio ||
                        'Aucune biographie.'}
                    </p>
                  </div>

                  <div className="d-flex gap-3 flex-wrap">
                    <button
                      className="btn btn-success"
                      onClick={handleEditToggle}
                    >
                      <i className="fas fa-edit me-2"></i>
                      Modifier profil
                    </button>

                    <Link
                      to="/my-recipes"
                      className="btn btn-outline-success"
                    >
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