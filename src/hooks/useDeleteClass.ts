import {AxiosResponse, isAxiosError} from "axios";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { DeleteClassPayload } from "@src/types/api-requests.types";
import {useEffect} from "react";
import {useLoader} from "@components/contexts/LoaderContext";
import {useClassesList} from "@src/hooks/useClassesList";

const LOADER_ID = 'delete-class';

export function useDeleteClass() {
  const {startLoading, stopLoading} = useLoader();
  const {refreshClasses} = useClassesList();

  const deleteClassFn = async (data: DeleteClassPayload) => {
    const response = await axiosClient.delete(API_ROUTES.deleteClass(data.classId));

    refreshClasses();

    return response.data;
  };

  // useMutation is waiting for instruction to send request
  const mutation: UseMutationResult<AxiosResponse, Error, DeleteClassPayload> = useMutation({
    mutationFn: deleteClassFn,
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
    deleteClass: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage: getErrorMessage(),
  };
}