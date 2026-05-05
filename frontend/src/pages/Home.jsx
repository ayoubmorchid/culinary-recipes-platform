import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import recipeService from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";
import Loading from "../components/Loading";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recipeService
      .getAll()
      .then((res) => setRecipes(res.data.slice(0, 3)))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section>
        <h1>Culinary Recipes Platform</h1>
        <p>Discover, share and manage delicious cooking recipes.</p>

        <Link to="/recipes">Browse Recipes</Link>
        {" | "}
        <Link to="/recipes/create">Create Recipe</Link>
      </section>

      <section>
        <h2>Latest Recipes</h2>

        {loading ? (
          <Loading message="Loading latest recipes..." />
        ) : (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))
        )}
      </section>
    </div>
  );
}

export default Home;