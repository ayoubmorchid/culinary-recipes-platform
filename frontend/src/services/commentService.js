import api from '../api/axios'

export const commentService = {
  // Get comments for recipe
  getComments: async (recipeSlug, page = 1, size = 10) => {
    const params = new URLSearchParams({ page, size })
    const response = await api.get(`/recipes/${recipeSlug}/comments?${params}`)
    return response.data
  },

  // Add comment
  addComment: async (recipeSlug, content) => {
    const response = await api.post(`/recipes/${recipeSlug}/comments`, { content })
    return response.data
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
  }
}
