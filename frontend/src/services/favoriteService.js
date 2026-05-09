import api from '../api/axios'

export const favoriteService = {
  getFavorites: async (page = 1, size = 12) => {
    const backendPage = Math.max(page - 1, 0)
    const params = new URLSearchParams({ page: backendPage, size })
    const response = await api.get(`/favorites?${params}`)
    return response.data
  },

  toggleFavorite: async (recipeId) => {
    const response = await api.post('/favorites/toggle', { recipeId })
    return response.data
  },

  removeFavorite: async (recipeId) => {
    const response = await api.delete(`/favorites/${recipeId}`)
    return response.data
  }
}
