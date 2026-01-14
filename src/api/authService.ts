import apiClient from "./axiosConfig";
import { User } from "../types/types";
import { AxiosError } from "axios";

export const authService = {
  /**
   * Ambil user login saat ini (endpoint protected)
   */
  fetchUser: async (): Promise<User | null> => {
    try {
      const { data } = await apiClient.get("/pengguna");

      return {
        ...data,
        roles: data.roles ?? [],
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        // Jika token invalid / expired
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }

        throw new Error(
          error.response?.data?.message || "Error fetching user."
        );
      }

      throw new Error("Unexpected error. Please try again.");
    }
  },

  /**
   * Login dan simpan token Sanctum
   */
  login: async (email: string, password: string): Promise<User> => {
    try {
      const { data } = await apiClient.post("/login", {
        email,
        password,
      });

      const token: string = data.token;

      // Simpan token
      localStorage.setItem("token", token);

      // Pasang Authorization header global
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      return {
        ...data.user,
        token,
        roles: data.user.roles ?? [],
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Invalid credentials."
        );
      }

      throw new Error("Unexpected error. Please try again.");
    }
  },

  /**
   * Logout dan hapus token
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
  },
};
