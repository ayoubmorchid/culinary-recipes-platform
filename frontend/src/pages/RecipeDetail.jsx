import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

function RecipeDetail() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    axios.get(`/recipes/${slug}`)
      .then((res) => setRecipe(res.data))
      .catch(() => alert("Recipe not found"));
  }, [slug]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <p>Author: {recipe.authorUsername}</p>
    </div>
  );
}

export default RecipeDetail;