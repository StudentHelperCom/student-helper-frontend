import { isAxiosError } from "axios";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {ClassListResponse} from "@src/types/api-requests.types";

export const CLASSES_QUERY_KEY = ['classes'];

export function useClassesList(token: string | null) {
  const queryClient = useQueryClient();

  const fetchClasses = async () => {
    if (!token) throw new Error("No token provided");

    const response = await axiosClient.get(API_ROUTES.classesList, {
      headers: {
        'Content-Type': undefined,
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  };

  const query: UseQueryResult<ClassListResponse[]> = useQuery({
    queryKey: CLASSES_QUERY_KEY,
    queryFn: fetchClasses,
    enabled: !!token,
    retry: 0,
  });

  const getErrorMessage = () => {
    const err = query.error;
    if (!err) return null;

    if (isAxiosError(err)) {
      if (err.response) return err.response.data?.message || "Server error";
      if (err.request) return "Server connection error, check your internet";
    }
    if (err instanceof Error) return err.message;
    return "Unknown error";
  };

  const refreshClasses = () => {
    queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY });
  };

  return {
    classes: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: getErrorMessage(),
    refreshClasses,
  };
}