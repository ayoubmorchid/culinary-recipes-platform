import axios from "../api/axios";

const recipeService = {
  getAll: () => axios.get("/recipes"),

  search: (query) =>
    axios.get(`/recipes/search?query=${encodeURIComponent(query)}`),

  getBySlug: (slug) =>
    axios.get(`/recipes/${slug}`),

  update: (slug, data) =>
    axios.put(`/recipes/${slug}`, data),

  remove: (slug) =>
    axios.delete(`/recipes/${slug}`),
};

export default recipeService;