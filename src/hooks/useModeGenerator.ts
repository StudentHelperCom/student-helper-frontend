import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import {ModeGeneratorPayload, ModeGeneratorResponse} from "@src/types/api-requests.types";
import { isAxiosError } from "axios";
import {useEffect} from "react";
import {useLoader} from "@components/contexts/LoaderContext";

const LOADER_ID = 'new-class';

export function useModeGenerator() {
  const {startLoading, stopLoading} = useLoader();

  const mutationFn = async (payload: ModeGeneratorPayload) => {
    const response = await axiosClient.post<ModeGeneratorResponse>(
      API_ROUTES.generateTasks,
      payload,
    );
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: mutationFn,
  });

  useEffect(() => {
    if (mutation.isPending) {
      startLoading(LOADER_ID);
    } else {
      stopLoading(LOADER_ID);
    }

    return () => {
      stopLoading(LOADER_ID);
    };
  }, [mutation.isPending, startLoading, stopLoading]);

  const getErrorMessage = () => {
    const err = mutation.error;
    if (!err) return null;

    if (isAxiosError(err)) {
      if (err.response) {
        return err.response.data?.message || `Server error: ${err.response.status}`;
      }
      if (err.request) return "Server connection error, check your internet";
    }

    return err.message;
  };

  return {
    generate: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage: getErrorMessage(),
  };
}