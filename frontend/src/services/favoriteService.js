import axios from "../api/axios";

const favoriteService = {
  getFavorites: (username) =>
    axios.get(`/favorites/${username}`),

  toggleFavorite: (username, slug) =>
    axios.post(`/favorites/${username}/${slug}/toggle`),
};

export default favoriteService;