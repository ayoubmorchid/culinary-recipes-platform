import { useEffect, useState } from "react";
import axios from "../api/axios";
import RecipeCard from "../components/RecipeCard";

function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("/recipes")
      .then((res) => setRecipes(res.data))
      .catch(() => alert("Failed to load recipes"));
  }, []);

  return (
    <div>
      <h1>Recipes</h1>

      {recipes.map((recipe) => (
        <RecipeCard key={recipe.slug} recipe={recipe} />
      ))}
    </div>
  );
}

export default Recipes;