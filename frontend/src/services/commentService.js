import axios from "../api/axios";

const commentService = {
  getComments: (slug) => axios.get(`/recipes/${slug}/comments`),

  addComment: (slug, content) =>
    axios.post(`/recipes/${slug}/comments`, { content }),
};

export default commentService;