import { useEffect, useState } from "react";
import dashboardService from "../services/dashboardService";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardService.getStats()
      .then((res) => setStats(res.data))
      .catch(() => alert("Failed to load dashboard"));
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>Total users: {stats.totalUsers}</p>
      <p>Total recipes: {stats.totalRecipes}</p>
      <p>Total categories: {stats.totalCategories}</p>
      <p>Total favorites: {stats.totalFavorites}</p>
    </div>
  );
}

export default AdminDashboard;