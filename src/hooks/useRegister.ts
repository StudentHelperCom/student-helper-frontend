import { useEffect } from "react";
import {AxiosError, isAxiosError} from "axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import { RegisterPayload, RegisterResponseSuccess } from "@src/types/api-requests.types";
import { useLoader } from "@components/contexts/LoaderContext";

export function useRegister() {
  const { setLoaderStatus } = useLoader();

  const registerFn = async (data: RegisterPayload) => {
    const response = await axiosClient.post<RegisterResponseSuccess>(API_ROUTES.register, data);

    return response.data;
  };

  const mutation: UseMutationResult<RegisterResponseSuccess, Error, RegisterPayload> = useMutation({
    mutationFn: registerFn,
    retry: 0,
  });

  useEffect(() => {
    setLoaderStatus(mutation.isPending);
  }, [mutation.isPending, setLoaderStatus]);

  const getErrorMessage = () => {
    const err = mutation.error;

    if (!err) return null;

    if (err instanceof AxiosError && err?.response?.data?.error?.message) {
      return err.response.data.error.message;
    }

    if (isAxiosError(err)) {
      if (err.response) return err.response.data?.message || `Server error: ${err.response.status}`;
      if (err.request) return "Server connection error, check your internet";
    }

    if (err instanceof Error) return err.message;
    return "Unknown error";
  };

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage: getErrorMessage(),
    reset: mutation.reset,
  };
}