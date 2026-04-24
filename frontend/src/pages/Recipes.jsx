import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get("/recipes")
      .then((res) => setRecipes(res.data))
      .catch(() => alert("Failed to load recipes"));
  }, []);

  return (
    <div>
      <h1>Recipes</h1>

      {recipes.map((recipe) => (
        <div key={recipe.slug}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          <Link to={`/recipes/${recipe.slug}`}>View recipe</Link>
        </div>
      ))}
    </div>
  );
}

export default Recipes;