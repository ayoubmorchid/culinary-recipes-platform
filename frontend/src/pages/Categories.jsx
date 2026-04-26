import { useEffect, useState } from "react";
import axios from "../api/axios";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => alert("Failed to load categories"));
  }, []);

  return (
    <div>
      <h1>Categories</h1>

      {categories.map((category) => (
        <div key={category.slug}>
          <h3>{category.name}</h3>
          <p>{category.slug}</p>
        </div>
      ))}
    </div>
  );
}

export default Categories;