import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types/types";
import { authService } from "../api/authService";
import { AuthContext } from "../context/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Tidak ada token → tidak perlu fetch user
    if (!token) {
      setLoading(false);
      return;
    }

    const initializeUser = async () => {
      try {
        const userData = await authService.fetchUser();
        setUser(userData);
      } catch (error) {
        // ✅ Token invalid / expired
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    const userData = await authService.login(email, password);

    // ✅ Simpan token
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }

    setUser(userData);
    navigate("/dashboard", { replace: true });
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
