import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Check existing session on app load
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get("/user/me"); // ✅ FIXED
        setUser(res.data);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error("Auth check failed:", err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // 🔐 Login
  const login = async (credentials) => {
    try {
      await api.post("/auth/login", credentials); // ✅ correct
      const res = await api.get("/user/me");      // ✅ FIXED
      setUser(res.data);
      return res.data;
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  // 🔐 Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            loading,
            isAuthenticated: !!user,
            login,
            logout,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
