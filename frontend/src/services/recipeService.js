import axios from "../api/axios";

const recipeService = {
  getAll: () => axios.get("/recipes"),

  getBySlug: (slug) =>
    axios.get(`/recipes/${slug}`),

  search: (query) =>
    axios.get(`/recipes/search?query=${encodeURIComponent(query)}`),

  create: (data) =>
    axios.post("/recipes", data),

  update: (slug, data) =>
    axios.put(`/recipes/${slug}`, data),

  remove: (slug) =>
    axios.delete(`/recipes/${slug}`),
};

export default recipeService;