import axios from "../api/axios";

const commentService = {
  getComments: (slug) => axios.get(`/recipes/${slug}/comments`),
};

export default commentService;