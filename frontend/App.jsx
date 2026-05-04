import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicProfile from "./pages/PublicProfile";
import RecipeDetail from "./pages/RecipeDetail";
import Recipes from "./pages/Recipes";
import CreateRecipe from "./pages/CreateRecipe";
import Categories from "./pages/Categories";
import Favorites from "./pages/Favorites";
import AdminDashboard from "./pages/AdminDashboard";
import Search from "./pages/Search";

import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<div>Home</div>} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/users/:username" element={<PublicProfile />} />

        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:slug" element={<RecipeDetail />} />

        <Route
          path="/recipes/create"
          element={
            <PrivateRoute>
              <CreateRecipe />
            </PrivateRoute>
          }
        />

        <Route path="/categories" element={<Categories />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>
  );
}

export default App;