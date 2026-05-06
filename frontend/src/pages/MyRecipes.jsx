import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import Loading from "../components/Loading";
import axios from "../api/axios";

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/recipes/author/test")
      .then((res) => setRecipes(res.data))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading message="Loading your recipes..." />;
  }

  return (
    <div>
      <h1>My Recipes</h1>

      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        recipes.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))
      )}
    </div>
  );
}

export default MyRecipes;