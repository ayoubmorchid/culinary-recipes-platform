import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicProfile from "./pages/PublicProfile";
import RecipeDetail from "./pages/RecipeDetail";
import Recipes from "./pages/Recipes";
import CreateRecipe from "./pages/CreateRecipe";
import Categories from "./pages/Categories";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <Routes>
      <Route path="/users/:username" element={<PublicProfile />} />
      <Route path="/" element={<div>Home</div>} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/login" element={<Login />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/recipes/create" element={<CreateRecipe />} />
      <Route path="/recipes/:slug" element={<RecipeDetail />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recipes" element={<Recipes />} />

    </Routes>
  );
}

export default App;