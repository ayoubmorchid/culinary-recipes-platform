import { createContext, useState } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = async (username, password) => {
    const res = await axios.post("/auth/login", { username, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
  };

  const register = async (username, email, password) => {
    await axios.post("/auth/register", { username, email, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}