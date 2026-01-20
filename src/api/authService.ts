import apiClient from "./axiosConfig";
import { User } from "../types/types";
import { AxiosError } from "axios";

export const authService = {
  /**
   * Ambil user login saat ini
   */
  fetchUser: async (): Promise<User> => {
    try {
      const { data } = await apiClient.get("/me");

      return {
        ...data,
        roles: data.roles ?? [],
      };
    } catch (error) {
      if (error instanceof AxiosError) {
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
   * Login
   */
  login: async (email: string, password: string): Promise<User> => {
    try {
      const { data } = await apiClient.post("/login", {
        email,
        password,
      });

      const token: string = data.access_token;

      localStorage.setItem("token", token);

      return {
        ...data.user,
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
   * Logout
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  },
};
