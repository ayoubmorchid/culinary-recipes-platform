import axios from "../api/axios";

const recipeService = {
  getAll: () => axios.get("/recipes"),

  search: (query) =>
    axios.get(`/recipes/search?query=${encodeURIComponent(query)}`),

  getBySlug: (slug) =>
    axios.get(`/recipes/${slug}`),
};

export default recipeService;