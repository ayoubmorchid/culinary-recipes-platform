import axios from "../api/axios";

const userService = {
  getMyProfile: () => axios.get("/users/me"),

  updateMyProfile: (data) => axios.put("/users/me", data),

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getPublicProfile: (username) => axios.get(`/users/${username}`),
};

export default userService;