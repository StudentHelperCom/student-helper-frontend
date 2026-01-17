import {AxiosResponse, isAxiosError} from "axios";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { UploadPayload } from "@src/types/api-requests.types";
import {useLoader} from "@components/contexts/LoaderContext";
import {useEffect} from "react";

const LOADER_ID = 'upload';

export function useUpload() {
  const {startLoading, stopLoading} = useLoader();

  const uploadFileFn = async ({ files, className }: UploadPayload) => {
    const formData = new FormData();

    formData.append('className', className);

    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axiosClient.post(API_ROUTES.upload, formData, {
      headers: {
        'Content-Type': undefined,
      },
    });

    return response.data;
  };

  const mutation: UseMutationResult<AxiosResponse | undefined, Error, UploadPayload> = useMutation({
    mutationFn: uploadFileFn,
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
    upload: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage: getErrorMessage(),
    reset: mutation.reset,
  };
}