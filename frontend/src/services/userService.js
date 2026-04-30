import axios from "../api/axios";

const userService = {
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post("/users/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default userService;