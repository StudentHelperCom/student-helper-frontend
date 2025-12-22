import { isAxiosError } from "axios";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {TopicsListResponse} from "@src/types/api-requests.types";

export const TOPICS_QUERY_KEY = 'topics';

export function useTopicsList(token: string | null, classId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = [TOPICS_QUERY_KEY, classId];

  const fetchTopics = async () => {
    if (!token) throw new Error("No token provided");
    if (!classId) throw new Error("No classId provided");

    const response = await axiosClient.get(API_ROUTES.classTopics(classId), {
      headers: {
        'Content-Type': undefined,
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  };

  const query: UseQueryResult<TopicsListResponse> = useQuery({
    queryKey: queryKey,
    queryFn: fetchTopics,
    enabled: !!token && !!classId,
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

  const refreshTopics = () => {
    queryClient.invalidateQueries({ queryKey: queryKey });
  };

  return {
    topics: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: getErrorMessage(),
    refreshTopics,
  };
}