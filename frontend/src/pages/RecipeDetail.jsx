import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import commentService from "../services/commentService";

function RecipeDetail() {
  const { slug } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`/recipes/${slug}`)
      .then((res) => setRecipe(res.data))
      .catch(() => alert("Recipe not found"));

    commentService
      .getComments(slug)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]));
  }, [slug]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <p>Author: {recipe.authorUsername}</p>

      <h2>Comments</h2>

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