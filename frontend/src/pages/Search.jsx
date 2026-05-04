import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import recipeService from "../services/recipeService";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const q = searchParams.get("q");

    if (!q) {
      setRecipes([]);
      return;
    }

    recipeService
      .search(q)
      .then((res) => setRecipes(res.data))
      .catch(() => setRecipes([]));
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setSearchParams({ q: query });
  };

  return (
    <div>
      <h1>Search Recipes</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipe"
        />

        <button type="submit">Search</button>
      </form>

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

export default Search;