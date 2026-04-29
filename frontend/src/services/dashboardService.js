import axios from "../api/axios";

const dashboardService = {
  getStats: () => axios.get("/dashboard"),
};

export default dashboardService;