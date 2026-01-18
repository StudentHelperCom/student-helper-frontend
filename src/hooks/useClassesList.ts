import { isAxiosError } from "axios";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {ClassListResponse} from "@src/types/api-requests.types";
import {useSession} from "next-auth/react";
import {useLoader} from "@components/contexts/LoaderContext";
import {useEffect} from "react";

export const CLASSES_QUERY_KEY = ['classes'];
const LOADER_ID = 'classes';

export function useClassesList() {
  const queryClient = useQueryClient();
  const {status} = useSession();
  const {startLoading, stopLoading} = useLoader();

  const fetchClasses = async () => {
    const response = await axiosClient.get(API_ROUTES.classesList);

    return response.data;
  };

  const query: UseQueryResult<ClassListResponse[]> = useQuery({
    queryKey: CLASSES_QUERY_KEY,
    queryFn: fetchClasses,
    enabled: status === 'authenticated',
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
    return err.message;
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