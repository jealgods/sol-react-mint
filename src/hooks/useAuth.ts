import { useState, useEffect } from "react";
import { User } from "../types";
import { fetchApi } from "../utils/api";
import { API_ENDPOINTS } from "../constants";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchApi<User>(API_ENDPOINTS.USER.PROFILE);
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetchApi<User>(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetchApi(API_ENDPOINTS.AUTH.LOGOUT, { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    logout,
  };
};
