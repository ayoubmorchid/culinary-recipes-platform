import api from '../api/axios'

export const commentService = {
  getComments: async (recipeSlug, page = 1, size = 10) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        size: String(size)
      })

      const response = await api.get(
        `/recipes/${recipeSlug}/comments?${params.toString()}`
      )

      return response.data
    } catch (error) {
      console.warn(
        'Paginated comments failed, trying fallback...'
      )

      const fallback = await api.get(
        `/recipes/${recipeSlug}/comments`
      )

      return fallback.data
    }
  },

  addComment: async (recipeSlug, content) => {
    const response = await api.post(
      `/recipes/${recipeSlug}/comments`,
      { content }
    )

    return response.data
  },

  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(
        `/comments/${commentId}`
      )

      return response.data
    } catch (error) {
      console.warn(
        'Delete comment endpoint not available.'
      )

      return null
    }
  }
}

export default commentService