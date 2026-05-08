import api from '../api/axios'

export const userService = {
  getMyProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },

  getPublicProfile: async (username) => {
    const response = await api.get(`/users/profile/${username}`)
    return response.data
  },

  updateProfile: async (profileData) => {
    const formData = new FormData()

    if (profileData.bio !== undefined) {
      formData.append('bio', profileData.bio)
    }

    if (profileData.avatar) {
      formData.append('avatar', profileData.avatar)
    }

    const response = await api.put(
      '/users/profile',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return response.data
  }
}

export default userService