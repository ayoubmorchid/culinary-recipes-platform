import axios from "../api/axios";

const ratingService = {
  getRatings: (slug) => axios.get(`/recipes/${slug}/ratings`),

  addRating: (slug, value) =>
    axios.post(`/recipes/${slug}/ratings`, { value }),
};

export default ratingService;