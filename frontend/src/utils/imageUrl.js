export const getImageUrl = (url, fallback = '/placeholder-recipe.jpg') => {
  if (!url) return fallback
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads/')) return url
  return `/uploads/${url}`
}

export const getAvatarUrl = (url, fallback = '/default-avatar.png') => {
  if (!url) return fallback
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads/')) return url
  return `/uploads/${url}`
}
