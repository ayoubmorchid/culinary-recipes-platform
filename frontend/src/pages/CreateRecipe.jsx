import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { recipeService } from '../services/recipeService'
import { useAuth } from '../hooks/useAuth'

const CreateRecipe = () => {
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
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const loadCategories = async () => {
    try {
      const data = await recipeService.getCategories()
      setCategories(data.content || data || [])
    } catch (error) {
      console.error('Erreur catégories:', error)
      setError('Impossible de charger les catégories.')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

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

  const validateForm = () => {
    if (!formData.title.trim()) {
      return 'Le titre est obligatoire.'
    }

    if (!formData.categoryId) {
      return 'Veuillez choisir une catégorie.'
    }

    if (!formData.description.trim()) {
      return 'La description est obligatoire.'
    }

    if (!formData.ingredients.trim()) {
      return 'Les ingrédients sont obligatoires.'
    }

    if (!formData.instructions.trim()) {
      return 'Les instructions sont obligatoires.'
    }

    if (Number(formData.preparationTime) < 0) {
      return 'Le temps de préparation ne peut pas être négatif.'
    }

    if (Number(formData.cookingTime) < 0) {
      return 'Le temps de cuisson ne peut pas être négatif.'
    }

    if (Number(formData.servings) < 1) {
      return 'Le nombre de portions doit être au moins 1.'
    }

    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationMessage = validateForm()

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setSubmitLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        preparationTime: Number(formData.preparationTime || 0),
        cookingTime: Number(formData.cookingTime || 0),
        servings: Number(formData.servings || 1)
      }

      await recipeService.createRecipe(payload)
      navigate('/my-recipes')
    } catch (error) {
      console.error('Erreur création:', error)

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Erreur lors de la création de la recette.'

      setError(message)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 fw-bold">
                  <i className="fas fa-plus-circle text-success me-3"></i>
                  Nouvelle Recette
                </h2>

                <Link to="/recipes" className="btn btn-outline-secondary">
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

            <div className="card-body p-0">
              <form onSubmit={handleSubmit}>
                <div className="row g-0">
                  <div className="col-lg-4 border-end">
                    <div className="p-5 text-center">
                      <div className="mb-4">
                        <label className="form-label fw-semibold mb-3 d-block">
                          <i className="fas fa-image me-2"></i>
                          Photo de la recette
                        </label>

                        <div
                          className="image-upload-area border border-dashed rounded-4 p-5 mb-3 position-relative overflow-hidden"
                          style={{
                            minHeight: '300px',
                            backgroundColor: '#f8f9fa',
                            cursor: 'pointer'
                          }}
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="img-fluid rounded-3 shadow"
                              style={{
                                maxHeight: '300px',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <>
                              <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                              <p className="text-muted mb-0">
                                Cliquez pour ajouter une image
                              </p>
                            </>
                          )}

                          <input
                            type="file"
                            className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>

                        <small className="text-muted">
                          JPG, PNG, WEBP ou GIF jusqu'à 5MB
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8 p-5">
                    <div className="row g-4">
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Titre *
                        </label>
                        <input
                          type="text"
                          name="title"
                          className="form-control form-control-lg"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          placeholder="ex: Tiramisu italien authentique"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Catégorie *
                        </label>
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

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          className="form-control"
                          rows="4"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          placeholder="Décrivez votre recette en quelques mots..."
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Préparation (min)
                        </label>
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
                        <label className="form-label fw-semibold">
                          Cuisson (min)
                        </label>
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
                        <label className="form-label fw-semibold">
                          Portions
                        </label>
                        <input
                          type="number"
                          name="servings"
                          className="form-control"
                          value={formData.servings}
                          onChange={handleNumberChange}
                          min="1"
                        />
                      </div>

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
                          placeholder={`200g de farine
2 œufs
100g de sucre`}
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
                          placeholder={`1. Préchauffer le four.
2. Mélanger les ingrédients.
3. Cuire pendant 30 minutes.`}
                        />
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            name="published"
                            id="published"
                            className="form-check-input"
                            checked={formData.published}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="published"
                          >
                            Publier directement cette recette
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-3 mt-5">
                      <button
                        type="submit"
                        className="btn btn-success btn-lg px-5 flex-grow-1"
                        disabled={submitLoading}
                      >
                        <i className="fas fa-save me-2"></i>
                        {submitLoading ? 'Publication...' : 'Publier ma recette'}
                      </button>

                      <Link to="/recipes" className="btn btn-outline-secondary px-5">
                        Annuler
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateRecipe