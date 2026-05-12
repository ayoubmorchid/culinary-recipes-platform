import api from '../api/axios'

export const userService = {
  getPublicProfile: async (username) => {
    const response = await api.get(`/users/profile/${username}`)
    return response.data
  },

  getMyProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },

  updateProfile: async (profileData) => {
    const formData = new FormData()

    formData.append('bio', profileData.bio ?? '')

    if (profileData.avatar) {
      formData.append('avatar', profileData.avatar)
    }

    const response = await api.put('/users/profile', formData)

    return response.data
  },

  getFavorites: async (page = 0, size = 12) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size)
    })

    const response = await api.get(`/favorites?${params.toString()}`)
    return response.data
  },

  toggleFavorite: async (recipeId) => {
    const response = await api.post('/favorites/toggle', {
      recipeId
    })

    return response.data
  },

  addFavorite: async (recipeId) => {
    const response = await api.post('/favorites', {
      recipeId
    })

    return response.data
  },

  removeFavorite: async (recipeId) => {
    const response = await api.delete(`/favorites/${recipeId}`)
    return response.data
  }
}
