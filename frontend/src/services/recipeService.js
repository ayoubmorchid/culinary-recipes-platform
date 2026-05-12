import api from '../api/axios'

export const recipeService = {
  // Get all recipes (paginated)
  getRecipes: async (page = 1, size = 12, search = '', categoryId = '') => {
    const backendPage = Math.max(page - 1, 0)
    const params = new URLSearchParams({ page: backendPage, size })
    if (search) params.append('search', search)
    if (categoryId) params.append('categoryId', categoryId)
    const response = await api.get(`/recipes?${params}`)
    return response.data
  },

  // Get single recipe by slug
  getRecipeBySlug: async (slug) => {
    const response = await api.get(`/recipes/slug/${slug}`)
    return response.data
  },

  // Create recipe
  createRecipe: async (recipeData) => {
    const formData = new FormData()
    formData.append('title', recipeData.title)
    formData.append('slug', recipeData.slug)
    formData.append('categoryId', recipeData.categoryId)
    formData.append('description', recipeData.description)
    formData.append('ingredients', recipeData.ingredients)
    formData.append('instructions', recipeData.instructions)
    formData.append('preparationTime', recipeData.preparationTime ?? 0)
    formData.append('cookingTime', recipeData.cookingTime ?? 0)
    formData.append('servings', recipeData.servings ?? 1)
    formData.append('published', recipeData.published ?? true)
    if (recipeData.image) formData.append('image', recipeData.image)
    
    const response = await api.post('/recipes', formData)
    return response.data
  },

  // Update recipe by slug
  updateRecipe: async (slug, recipeData) => {
    const formData = new FormData()
    formData.append('title', recipeData.title)
    formData.append('slug', recipeData.slug)
    formData.append('categoryId', recipeData.categoryId)
    formData.append('description', recipeData.description)
    formData.append('ingredients', recipeData.ingredients)
    formData.append('instructions', recipeData.instructions)
    formData.append('preparationTime', recipeData.preparationTime ?? 0)
    formData.append('cookingTime', recipeData.cookingTime ?? 0)
    formData.append('servings', recipeData.servings ?? 1)
    formData.append('published', recipeData.published ?? true)
    if (recipeData.image) formData.append('image', recipeData.image)
    
    const response = await api.put(`/recipes/${slug}`, formData)
    return response.data
  },

  // Delete recipe by slug
  deleteRecipe: async (slug) => {
    const response = await api.delete(`/recipes/${slug}`)
    return response.data
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/recipes/categories')
    return response.data
  },

  // Get latest recipes
  getLatestRecipes: async (limit = 8) => {
    const response = await api.get(`/recipes/latest?limit=${limit}`)
    return response.data
  },

  // Get top rated
  getTopRated: async (limit = 6) => {
    const response = await api.get(`/recipes/top-rated?limit=${limit}`)
    return response.data
  },

  // My recipes
  getMyRecipes: async (page = 1, size = 12) => {
    const backendPage = Math.max(page - 1, 0)
    const params = new URLSearchParams({ page: backendPage, size })
    const response = await api.get(`/recipes/my-recipes?${params}`)
    return response.data
  }
}
