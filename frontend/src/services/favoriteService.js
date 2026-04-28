import axios from "../api/axios";

const favoriteService = {

    getFavorites: (username) =>
        axios.get(`/favorites/${username}`),
};

export default favoriteService;