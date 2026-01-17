import {AxiosResponse, isAxiosError} from "axios";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import {EvaluatedResponse, EvaluatePayload} from "@src/types/api-requests.types";
import {useEffect} from "react";
import {useLoader} from "@components/contexts/LoaderContext";

const LOADER_ID = 'evaluate';

export function useEvaluate() {
  const {startLoading, stopLoading} = useLoader();

  const evaluateAnswers = async (data: EvaluatePayload) => {
    const response = await axiosClient.post(API_ROUTES.evaluateTasks, data);

    return response.data;
  };

  // useMutation is waiting for instruction to send request
  const mutation: UseMutationResult<EvaluatedResponse, Error, EvaluatePayload> = useMutation({
    mutationFn: evaluateAnswers,
    retry: 0,
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
      if (err.response) return err.response.data?.message || "Server error";
      if (err.request) return "Server connection error, check your internet";
    }
    if (err instanceof Error) return err.message;
    return "Unknown error";
  };

  return {
    evaluate: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage: getErrorMessage(),
    reset: mutation.reset,
  };
}