import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import axios from "../api/axios";
import commentService from "../services/commentService";
import ratingService from "../services/ratingService";
import favoriteService from "../services/favoriteService";
import recipeService from "../services/recipeService";

function RecipeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [ratingValue, setRatingValue] = useState(5);

  useEffect(() => {
    axios
      .get(`/recipes/${slug}`)
      .then((res) => setRecipe(res.data))
      .catch(() => alert("Recipe not found"));

    ratingService
      .getRatings(slug)
      .then((res) => setRatings(res.data))
      .catch(() => setRatings([]));

    commentService
      .getComments(slug)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]));
  }, [slug]);

  const handleToggleFavorite = async () => {
    try {
      const username = "test";
      const res = await favoriteService.toggleFavorite(username, slug);
      alert(res.data);
    } catch (error) {
      alert("Failed to update favorite");
    }
  };

  const handleDeleteRecipe = async () => {
    if (!window.confirm("Delete this recipe?")) {
      return;
    }

    try {
      await recipeService.remove(slug);
      alert("Recipe deleted");
      navigate("/recipes");
    } catch (error) {
      alert("Failed to delete recipe");
    }
  };

  const handleAddRating = async (e) => {
    e.preventDefault();

    try {
      const res = await ratingService.addRating(slug, Number(ratingValue));
      setRatings((prevRatings) => [...prevRatings, res.data]);
      alert("Rating added");
    } catch (error) {
      alert("Failed to add rating");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    try {
      const res = await commentService.addComment(slug, newComment);
      setComments((prevComments) => [...prevComments, res.data]);
      setNewComment("");
    } catch (error) {
      alert("Failed to add comment");
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h1>{recipe.title}</h1>

      <p>{recipe.description}</p>
      <p>Author: {recipe.authorUsername}</p>
      <p>Average rating: {recipe.averageRating || 0}</p>
      <p>Total ratings: {recipe.totalRatings || ratings.length}</p>

      <div>
        <Link to={`/recipes/${slug}/edit`}>Edit Recipe</Link>

        <button onClick={handleDeleteRecipe}>
          Delete Recipe
        </button>

        <button onClick={handleToggleFavorite}>
          Toggle Favorite
        </button>
      </div>

      <h2>Rate this recipe</h2>

      <form onSubmit={handleAddRating}>
        <select
          value={ratingValue}
          onChange={(e) => setRatingValue(e.target.value)}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <button type="submit">Submit rating</button>
      </form>

      <h2>Comments</h2>

      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment"
        />

        <button type="submit">Add Comment</button>
      </form>

      {comments.map((comment, index) => (
        <div key={index}>
          <p>{comment.content}</p>
          <small>{comment.authorUsername || "Anonymous"}</small>
        </div>
      ))}
    </div>
  );
}

export default RecipeDetail;