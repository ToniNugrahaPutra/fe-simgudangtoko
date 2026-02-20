import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { AxiosError } from "axios";
import { ApiErrorResponse, CreateUserPayload, User } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const useFetchUsers = () => {
  const { user } = useAuth();

  const isAdmin = user?.roles?.some((r) => (typeof r === "string" ? r === "admin" : r.name === "admin"));

  return useQuery<User[], AxiosError>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get("/pengguna");
      return response.data;
    },
    enabled: !!user && isAdmin,
  });
};

// =======================
// Fetch Single User by ID
// =======================
export const useFetchUser = (id: number) => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.some(r => r.name === "admin");

  return useQuery<User, AxiosError>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await apiClient.get(`/pengguna/${id}`);
      return response.data;
    },
    enabled: !!id && isAdmin,
  });
};


// =======================
// Create User
// =======================
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<FormData, AxiosError<ApiErrorResponse>, FormData>({
    mutationFn: async (formData) => {
      const response = await apiClient.post("/pengguna", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
  });
};

// =======================
// Update User
// =======================
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<User, AxiosError<ApiErrorResponse>, { id: number } & CreateUserPayload>({
    mutationFn: async ({ id, ...payload }) => {
      const formData = new FormData();

      formData.append("nama", payload.name);
      formData.append("no_hp", payload.phone);

      if (payload.email) {
        formData.append("email", payload.email);
      }

      formData.append("password", payload.password);
      formData.append("password_confirmation", payload.password_confirmation);

      if (payload.photo instanceof File) {
        formData.append("foto", payload.photo);
      }

      const response = await apiClient.post(`/pengguna/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      navigate("/users");
    },
  });
};

// =======================
// Delete User
// =======================
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/pengguna/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
