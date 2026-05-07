import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { recipeService } from '../services/recipeService'
import Loading from '../components/Loading'

const EditRecipe = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    ingredients: '',
    instructions: '',
    preparationTime: 0,
    cookingTime: 0,
    servings: 1,
    published: true,
    image: null
  })

  const [categories, setCategories] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [slug])

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const loadData = async () => {
    try {
      setLoading(true)

      const [recipe, categoriesData] = await Promise.all([
        recipeService.getRecipeBySlug(slug),
        recipeService.getCategories()
      ])

      setFormData({
        title: recipe.title || '',
        categoryId: recipe.categoryId || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients || '',
        instructions: recipe.instructions || '',
        preparationTime: recipe.preparationTime || 0,
        cookingTime: recipe.cookingTime || 0,
        servings: recipe.servings || 1,
        published: recipe.published ?? true,
        image: null
      })

      setCurrentImage(recipe.imageUrl || '')

      setCategories(
        Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.content || []
      )
    } catch (error) {
      console.error('Erreur chargement édition:', error)
      setError('Impossible de charger la recette.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }))
  }

  const handleImageChange = (e) => {
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

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setError('')
    setImagePreview(URL.createObjectURL(file))

    setFormData((prev) => ({
      ...prev,
      image: file
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) return 'Le titre est obligatoire.'
    if (!formData.categoryId) return 'Veuillez choisir une catégorie.'
    if (!formData.description.trim()) return 'La description est obligatoire.'
    if (!formData.ingredients.trim()) return 'Les ingrédients sont obligatoires.'
    if (!formData.instructions.trim()) return 'Les instructions sont obligatoires.'
    if (Number(formData.preparationTime) < 0) return 'Le temps de préparation ne peut pas être négatif.'
    if (Number(formData.cookingTime) < 0) return 'Le temps de cuisson ne peut pas être négatif.'
    if (Number(formData.servings) < 1) return 'Le nombre de portions doit être au moins 1.'

    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationMessage = validateForm()

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    try {
      setSubmitLoading(true)
      setError('')

      const payload = {
        ...formData,
        categoryId: Number(formData.categoryId),
        preparationTime: Number(formData.preparationTime || 0),
        cookingTime: Number(formData.cookingTime || 0),
        servings: Number(formData.servings || 1)
      }

      const updated = await recipeService.updateRecipe(slug, payload)

      navigate(`/recipes/${updated.slug || slug}`)
    } catch (error) {
      console.error('Erreur modification:', error)

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Erreur lors de la modification de la recette.'

      setError(message)
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Chargement de l'édition de recette..." />
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 fw-bold">
                  <i className="fas fa-edit text-success me-3"></i>
                  Modifier la recette
                </h2>

                <Link to={`/recipes/${slug}`} className="btn btn-outline-secondary">
                  <i className="fas fa-arrow-left me-2"></i>
                  Retour
                </Link>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
            </div>

            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Image</label>

                  {(imagePreview || currentImage) && (
                    <div className="mb-3">
                      <img
                        src={imagePreview || currentImage}
                        alt="Preview"
                        className="rounded shadow-sm"
                        style={{
                          width: '220px',
                          height: '150px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Titre *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control form-control-lg"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Catégorie *</label>
                  <select
                    name="categoryId"
                    className="form-select form-select-lg"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choisir une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Description *</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Préparation (min)</label>
                    <input
                      type="number"
                      name="preparationTime"
                      className="form-control"
                      value={formData.preparationTime}
                      onChange={handleNumberChange}
                      min="0"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Cuisson (min)</label>
                    <input
                      type="number"
                      name="cookingTime"
                      className="form-control"
                      value={formData.cookingTime}
                      onChange={handleNumberChange}
                      min="0"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Portions</label>
                    <input
                      type="number"
                      name="servings"
                      className="form-control"
                      value={formData.servings}
                      onChange={handleNumberChange}
                      min="1"
                    />
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Ingrédients * (un par ligne)
                    </label>

                    <textarea
                      name="ingredients"
                      className="form-control"
                      rows="8"
                      value={formData.ingredients}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Instructions * (une étape par ligne)
                    </label>

                    <textarea
                      name="instructions"
                      className="form-control"
                      rows="8"
                      value={formData.instructions}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    name="published"
                    id="published"
                    className="form-check-input"
                    checked={formData.published}
                    onChange={handleChange}
                  />

                  <label className="form-check-label" htmlFor="published">
                    Recette publiée
                  </label>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg px-5"
                    disabled={submitLoading}
                  >
                    <i className="fas fa-save me-2"></i>
                    {submitLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>

                  <Link to={`/recipes/${slug}`} className="btn btn-outline-secondary btn-lg px-5">
                    Annuler
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditRecipe