import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicProfile from "./pages/PublicProfile";
import RecipeDetail from "./pages/RecipeDetail";
import Recipes from "./pages/Recipes";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import Categories from "./pages/Categories";
import Favorites from "./pages/Favorites";
import AdminDashboard from "./pages/AdminDashboard";
import Search from "./pages/Search";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

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

          <Route
            path="/recipes/:slug/edit"
            element={
              <PrivateRoute>
                <EditRecipe />
              </PrivateRoute>
            }
          />

          <Route path="/categories" element={<Categories />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<Search />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;