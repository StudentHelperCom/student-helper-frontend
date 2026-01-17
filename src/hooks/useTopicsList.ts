import { isAxiosError } from "axios";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { TopicsListResponse } from "@src/types/api-requests.types";
import { useSession } from "next-auth/react";
import {useLoader} from "@components/contexts/LoaderContext";
import {useEffect} from "react";

export const TOPICS_QUERY_KEY = 'topics';
const LOADER_ID = 'topics';

export function useTopicsList(classId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = [TOPICS_QUERY_KEY, classId];
  const {startLoading, stopLoading} = useLoader();
  const { status } = useSession();

  const fetchTopics = async () => {
    if (!classId) throw new Error("No classId provided");

    const response = await axiosClient.get(API_ROUTES.classTopics(classId));

    return response.data;
  };

  const query: UseQueryResult<TopicsListResponse> = useQuery({
    queryKey: queryKey,
    queryFn: fetchTopics,
    enabled: status === 'authenticated' && !!classId,
    retry: 0,
  });

  useEffect(() => {
    if (query.isFetching) {
      startLoading(LOADER_ID);
    } else {
      stopLoading(LOADER_ID);
    }

    return () => {
      stopLoading(LOADER_ID);
    };
  }, [query.isFetching, startLoading, stopLoading]);

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