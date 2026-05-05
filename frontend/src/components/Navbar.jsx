import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      {" | "}
      <Link to="/recipes">Recipes</Link>
      {" | "}
      <Link to="/search">Search</Link>
      {" | "}
      <Link to="/categories">Categories</Link>

      {token ? (
        <>
          {" | "}
          <Link to="/recipes/create">Create Recipe</Link>
          {" | "}
          <Link to="/favorites">Favorites</Link>
          {" | "}
          <Link to="/admin">Admin</Link>
          {" | "}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          {" | "}
          <Link to="/login">Login</Link>
          {" | "}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;