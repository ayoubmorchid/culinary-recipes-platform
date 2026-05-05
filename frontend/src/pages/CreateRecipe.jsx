import { useState } from "react";
import { useNavigate } from "react-router-dom";
import recipeService from "../services/recipeService";

function CreateRecipe() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await recipeService.create(formData);
      alert("Recipe created");
      navigate(`/recipes/${res.data.slug}`);
    } catch (error) {
      alert("Failed to create recipe");
    }
  };

  return (
    <div>
      <h1>Create Recipe</h1>

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

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateRecipe;