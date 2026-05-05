import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  return (
    <div>
      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>

      {recipe.categoryName && (
        <small>Category: {recipe.categoryName}</small>
      )}

      <br />

      <Link to={`/recipes/${recipe.slug}`}>
        View recipe
      </Link>
    </div>
  );
}

export default RecipeCard;