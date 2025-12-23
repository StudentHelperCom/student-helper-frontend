import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import { RegisterPayload, RegisterResponseSuccess } from "@src/types/api-requests.types";
import { isAxiosError } from "axios";

export function useRegister() {
  const mutationFn = async (data: RegisterPayload) => {
    const response = await axiosClient.post<RegisterResponseSuccess>(API_ROUTES.register, data);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: mutationFn,
  });

  const getErrorMessage = () => {
    const err = mutation.error;
    if (!err) return null;

    if (isAxiosError(err)) {
      if (err.response) {
        if (err.response.data?.status === "USER_ALREADY_EXISTS") {
          return "User already exists";
        }
        return err.response.data?.message || `Server error: ${err.response.status}`;
      }

      if (err.request) return "Server connection error, check your internet";
    }

    if (err instanceof Error) return err.message;

    return "Unknown error";
  };

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,

    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage: getErrorMessage(),

    data: mutation.data
  };
}