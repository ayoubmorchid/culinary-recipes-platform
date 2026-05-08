import api from '../api/axios'

export const recipeService = {
  getRecipes: async (page = 1, size = 12, search = '', categoryId = '') => {
    const backendPage = Math.max(page - 1, 0)

    const params = new URLSearchParams({
      page: String(backendPage),
      size: String(size)
    })

    if (search) params.append('search', search)
    if (categoryId) params.append('categoryId', categoryId)

    const response = await api.get(`/recipes?${params.toString()}`)
    return response.data
  },

  getRecipeBySlug: async (slug) => {
    try {
      const response = await api.get(`/recipes/slug/${slug}`)
      return response.data
    } catch (error) {
      const fallback = await api.get(`/recipes/${slug}`)
      return fallback.data
    }
  },

  createRecipe: async (recipeData) => {
    const formData = new FormData()

    formData.append('title', recipeData.title)
    formData.append('categoryId', recipeData.categoryId)
    formData.append('description', recipeData.description)
    formData.append('ingredients', recipeData.ingredients)
    formData.append('instructions', recipeData.instructions)
    formData.append('preparationTime', recipeData.preparationTime || 0)
    formData.append('cookingTime', recipeData.cookingTime || 0)
    formData.append('servings', recipeData.servings || 1)
    formData.append('published', recipeData.published ?? true)

    if (recipeData.image) {
      formData.append('image', recipeData.image)
    }

    const response = await api.post('/recipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  updateRecipe: async (slug, recipeData) => {
    const formData = new FormData()

    formData.append('title', recipeData.title)
    formData.append('categoryId', recipeData.categoryId)
    formData.append('description', recipeData.description)
    formData.append('ingredients', recipeData.ingredients)
    formData.append('instructions', recipeData.instructions)
    formData.append('preparationTime', recipeData.preparationTime || 0)
    formData.append('cookingTime', recipeData.cookingTime || 0)
    formData.append('servings', recipeData.servings || 1)
    formData.append('published', recipeData.published ?? true)

    if (recipeData.image) {
      formData.append('image', recipeData.image)
    }

    try {
      const response = await api.put(`/recipes/slug/${slug}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data
    } catch (error) {
      const fallback = await api.put(`/recipes/${slug}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return fallback.data
    }
  },

  deleteRecipe: async (slug) => {
    try {
      const response = await api.delete(`/recipes/slug/${slug}`)
      return response.data
    } catch (error) {
      const fallback = await api.delete(`/recipes/${slug}`)
      return fallback.data
    }
  },

  getCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  },

  getLatestRecipes: async (limit = 8) => {
    try {
      const response = await api.get(`/recipes/latest?limit=${limit}`)
      return response.data
    } catch (error) {
      const fallback = await api.get('/recipes')
      return fallback.data
    }
  },

  getTopRated: async (limit = 6) => {
    try {
      const response = await api.get(`/recipes/top-rated?limit=${limit}`)
      return response.data
    } catch (error) {
      const fallback = await api.get('/recipes')
      return fallback.data
    }
  },

  getMyRecipes: async (page = 1, size = 12) => {
    const backendPage = Math.max(page - 1, 0)

    const params = new URLSearchParams({
      page: String(backendPage),
      size: String(size)
    })

    const response = await api.get(`/recipes/my-recipes?${params.toString()}`)
    return response.data
  }
}

export default recipeService