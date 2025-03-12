import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    setUser(jwtDecode(access));
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const isAuthenticated = () => !!localStorage.getItem("accessToken");

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
