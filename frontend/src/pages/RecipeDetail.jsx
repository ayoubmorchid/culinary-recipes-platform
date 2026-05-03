import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import commentService from "../services/commentService";
import ratingService from "../services/ratingService";

function RecipeDetail() {
  const { slug } = useParams();
  const [ratings, setRatings] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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