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

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
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

    if (imagePreview) URL.revokeObjectURL(imagePreview)

    setError('')
    setImagePreview(URL.createObjectURL(file))
    setFormData((prev) => ({ ...prev, image: file }))
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
    <div className="luxury-form-page">
      <div className="container py-5">
        <div className="luxury-form-header">
          <div>
            <span className="luxury-mini-title">Création</span>
            <h1>Nouvelle Recette</h1>
            <p>Partagez votre meilleure recette avec la communauté.</p>
          </div>

          <Link to="/recipes" className="btn luxury-secondary-btn">
            <i className="fas fa-arrow-left me-2"></i>
            Retour
          </Link>
        </div>

        {error && (
          <div className="luxury-alert-danger">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="luxury-recipe-form">
          <div className="row g-0">
            <div className="col-lg-4 luxury-form-side">
              <label className="luxury-form-label text-center d-block mb-3">
                <i className="fas fa-image me-2"></i>
                Photo de la recette
              </label>

              <div className="luxury-image-upload">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" />
                ) : (
                  <div>
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Cliquez pour ajouter une image</p>
                    <small>JPG, PNG, WEBP ou GIF jusqu'à 5MB</small>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="col-lg-8 luxury-form-main">
              <div className="row g-4">
                <div className="col-12">
                  <label className="luxury-form-label">Titre *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control luxury-input"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="ex: Tiramisu italien authentique"
                  />
                </div>

                <div className="col-12">
                  <label className="luxury-form-label">Catégorie *</label>
                  <select
                    name="categoryId"
                    className="form-select luxury-input"
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
                  <label className="luxury-form-label">Description *</label>
                  <textarea
                    name="description"
                    className="form-control luxury-input"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Décrivez votre recette en quelques mots..."
                  />
                </div>

                <div className="col-md-4">
                  <label className="luxury-form-label">Préparation</label>
                  <input
                    type="number"
                    name="preparationTime"
                    className="form-control luxury-input"
                    value={formData.preparationTime}
                    onChange={handleNumberChange}
                    min="0"
                  />
                </div>

                <div className="col-md-4">
                  <label className="luxury-form-label">Cuisson</label>
                  <input
                    type="number"
                    name="cookingTime"
                    className="form-control luxury-input"
                    value={formData.cookingTime}
                    onChange={handleNumberChange}
                    min="0"
                  />
                </div>

                <div className="col-md-4">
                  <label className="luxury-form-label">Portions</label>
                  <input
                    type="number"
                    name="servings"
                    className="form-control luxury-input"
                    value={formData.servings}
                    onChange={handleNumberChange}
                    min="1"
                  />
                </div>

                <div className="col-md-6">
                  <label className="luxury-form-label">
                    Ingrédients * <small>(un par ligne)</small>
                  </label>
                  <textarea
                    name="ingredients"
                    className="form-control luxury-input"
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
                  <label className="luxury-form-label">
                    Instructions * <small>(une étape par ligne)</small>
                  </label>
                  <textarea
                    name="instructions"
                    className="form-control luxury-input"
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
                  <div className="luxury-check">
                    <input
                      type="checkbox"
                      name="published"
                      id="published"
                      checked={formData.published}
                      onChange={handleChange}
                    />
                    <label htmlFor="published">
                      Publier directement cette recette
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column flex-md-row gap-3 mt-5">
                <button
                  type="submit"
                  className="btn luxury-main-btn btn-lg px-5 flex-grow-1"
                  disabled={submitLoading}
                >
                  <i className="fas fa-save me-2"></i>
                  {submitLoading ? 'Publication...' : 'Publier ma recette'}
                </button>

                <Link to="/recipes" className="btn luxury-secondary-btn btn-lg px-5">
                  Annuler
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRecipe