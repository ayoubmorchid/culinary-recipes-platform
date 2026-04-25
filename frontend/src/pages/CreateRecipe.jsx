import { useState } from "react";
import axios from "../api/axios";

function CreateRecipe() {
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
      await axios.post("/recipes", formData);
      alert("Recipe created");
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
          placeholder="Recipe title"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Recipe description"
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateRecipe;