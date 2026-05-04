import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import recipeService from "../services/recipeService";

function EditRecipe() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    recipeService
      .getBySlug(slug)
      .then((res) => {
        setFormData({
          title: res.data.title || "",
          description: res.data.description || "",
        });
      })
      .catch(() => alert("Recipe not found"));
  }, [slug]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await recipeService.update(slug, formData);
      alert("Recipe updated");
      navigate(`/recipes/${res.data.slug}`);
    } catch (error) {
      alert("Failed to update recipe");
    }
  };

  return (
    <div>
      <h1>Edit Recipe</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Recipe title"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Recipe description"
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditRecipe;