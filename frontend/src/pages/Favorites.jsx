import { useEffect, useState } from "react";
import favoriteService from "../services/favoriteService";

function Favorites() {

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {

    favoriteService.getFavorites("test")
      .then((res) => setFavorites(res.data))
      .catch(() => setFavorites([]));

  }, []);

  return (
    <div>
      <h1>Favorites</h1>

      {favorites.map((favorite) => (
        <div key={favorite.id}>
          <h3>{favorite.recipeTitle}</h3>
          <p>{favorite.recipeSlug}</p>
        </div>
      ))}
    </div>
  );
}

export default Favorites;