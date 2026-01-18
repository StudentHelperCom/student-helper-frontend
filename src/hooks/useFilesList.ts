import { isAxiosError } from "axios";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { FilesListResponse } from "@src/types/api-requests.types";
import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {useLoader} from "@components/contexts/LoaderContext";

export const FILES_QUERY_KEY = 'files';
const LOADER_ID = 'files';

export function useFilesList(classId: string | null) {
  const queryClient = useQueryClient();
  const {status} = useSession();
  const {startLoading, stopLoading} = useLoader();
  const queryKey = [FILES_QUERY_KEY, classId];

  const fetchFiles = async () => {
    if (!classId) throw new Error("No classId provided");

    const response = await axiosClient.get(API_ROUTES.classFiles(classId));

    return response.data;
  };

  // useQuery frequently sends requests to keep information up to date
  const query: UseQueryResult<FilesListResponse> = useQuery({
    queryKey: queryKey,
    queryFn: fetchFiles,
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
    return err.message;
  };

  const refreshFiles = () => {
    queryClient.invalidateQueries({ queryKey: queryKey });
  };

  return {
    files: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: getErrorMessage(),
    refreshFiles,
  };
}