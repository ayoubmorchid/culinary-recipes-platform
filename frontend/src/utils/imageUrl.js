const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8080'

export const getImageUrl = (
  url,
  fallback = '/placeholder-recipe.jpg'
) => {
  if (!url) return fallback

  if (url.startsWith('http')) {
    return url
  }

  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`
  }

  return `${API_BASE_URL}/uploads/${url}`
}

export const getAvatarUrl = (
  url,
  fallback = '/default-avatar.png'
) => {
  if (!url) return fallback

  if (url.startsWith('http')) {
    return url
  }

  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`
  }

  return `${API_BASE_URL}/uploads/${url}`
}