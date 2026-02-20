import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { AxiosError } from "axios";
import {
  ApiErrorResponse,
  CreateTransactionPayload,
  CreateTransactionResponse,
  Transaction,
} from "../types/types";
import { useTransaction } from "../context/TransactionContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const fetchMerchantTransactions = async (): Promise<Transaction[]> => {
  const response = await apiClient.get("/my-toko/transaksi");
  return response.data.data;
};

const fetchAllTransactions = async (): Promise<Transaction[]> => {
  const response = await apiClient.get("/transaksi");
  return response.data.data ?? response.data;
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { transaction, cart, clearTransaction } = useTransaction();
  const navigate = useNavigate();

  return useMutation<
    CreateTransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateTransactionPayload
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/transaksi", payload);
      return response.data;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["merchant-transactions"] });

      const subTotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const taxTotal = subTotal * 0.1;
      const grandTotal = subTotal + taxTotal;
      const totalItems = cart.length;
      const totalQuantity = cart.reduce((sum, p) => sum + p.quantity, 0);

      clearTransaction();

      navigate("/transaction/success", {
        state: {
          customerName: transaction.name,
          totalItems,
          totalQuantity,
          subTotal,
          taxTotal,
          grandTotal,
          transactionId: data.id,
        },
      });
    },
  });
};


export const useFetchMerchantTransactions = (enabled = true) => {
  return useQuery<Transaction[], AxiosError>({
    queryKey: ["merchant-transactions"],
    queryFn: fetchMerchantTransactions,
    enabled,
    retry: false,
  });
};

export const useFetchAllTransactions = (enabled = true) => {
  return useQuery<Transaction[], AxiosError>({
    queryKey: ["all-transactions"],
    queryFn: fetchAllTransactions,
    enabled,
    retry: false,
  });
};

export const useFetchTransaction = (id: number) => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.some(
    (r) => (typeof r === "string" ? r === "admin" : r.name === "admin")
  );

  return useQuery<Transaction, AxiosError>({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const response = await apiClient.get(`/transaksi/${id}`);
      return response.data;
    },
    enabled: !!id && !!user && isAdmin,
  });
};
