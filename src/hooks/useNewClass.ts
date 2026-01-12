import {AxiosResponse, isAxiosError} from "axios";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { NewClassPayload } from "@src/types/api-requests.types";
import { useEffect } from "react";
import { useLoader } from "@components/contexts/LoaderContext";

export function useNewClass() {
  const { setLoaderStatus } = useLoader();

  const createNewClassFn = async ({ token, ...data }: NewClassPayload) => {
    const response = await axiosClient.post(API_ROUTES.newClass, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  };

  const mutation: UseMutationResult<AxiosResponse, Error, NewClassPayload> = useMutation({
    mutationFn: createNewClassFn,
    retry: 0,
  });

  useEffect(() => {
    setLoaderStatus(mutation.isPending);
  }, [mutation.isPending, setLoaderStatus]);


  const getErrorMessage = () => {
    const err = mutation.error;
    if (!err) return null;

    if (isAxiosError(err)) {
      if (err.response) return err.response.data?.message || "Server error";
      if (err.request) return "Server connection error, check your internet";
    }
    if (err instanceof Error) return err.message;
    return "Unknown error";
  };

  return {
    createNewClass: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage: getErrorMessage(),
    reset: mutation.reset,
  };
}