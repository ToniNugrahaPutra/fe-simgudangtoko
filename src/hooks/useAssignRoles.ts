import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../types/types";
import { useNavigate } from "react-router-dom";

interface AssignUserRolePayload {
  pengguna_id: number;
  role: string;
}

export const useAssignUserRole = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    AssignUserRolePayload
  >({
    mutationFn: async (payload) => {
      return apiClient.post("/pengguna/role", payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },

    onError: (error) => {
      console.error("Failed to assign role:", error.response?.data);
    },
  });
};
