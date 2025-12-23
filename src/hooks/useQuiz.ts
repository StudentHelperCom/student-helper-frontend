import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import { GenerateQuizPayload, GenerateQuizResponse } from "@src/types/api-requests.types";
import { isAxiosError } from "axios";

export function useQuiz(token: string | null) {

  const mutationFn = async (payload: GenerateQuizPayload) => {
    if (!token) throw new Error("No token provided");

    const response = await axiosClient.post<GenerateQuizResponse>(
      API_ROUTES.generateQuiz,
      payload,
      {
        headers: {
          'Content-Type': undefined,
          'Authorization': `Bearer ${token}`
        }
      }
    );
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
        return err.response.data?.message || `Server error: ${err.response.status}`;
      }
      if (err.request) return "Server connection error, check your internet";
    }

    if (err instanceof Error) return err.message;
    return "Unknown error";
  };

  return {
    generateQuiz: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage: getErrorMessage(),
  };
}