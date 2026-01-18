import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { axiosClient } from "@src/lib/axiosClient";
import { API_ROUTES } from "@src/config/api";
import { ProcessStatusResponse } from "@src/types/api-requests.types";

export const STATUS_QUERY_KEY = 'processStatus';

export function useProcessStatus(classId: string | null) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const queryKey = useMemo(() => [STATUS_QUERY_KEY, classId], [classId]);
  const [currentStatus, setCurrentStatus] = useState<'processing' | 'success' | 'failed' | undefined>(undefined);

  const [isTracking, setIsTracking] = useState(false);

  const fetchStatus = async () => {
    if (!classId) throw new Error("No classId");
    const token = session?.user?.backendToken;
    const response = await axiosClient.get(API_ROUTES.processingStatus(classId), {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  const query = useQuery<ProcessStatusResponse>({
    queryKey: queryKey,
    queryFn: fetchStatus,
    enabled: !!classId && !!session?.user?.backendToken && isTracking,
    retry: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status !== 'processing') return false;
      return 10000;
    },
    refetchIntervalInBackground: true,
  });

  const isFinished = query.data?.status === 'success' || query.data?.status === 'failed';

  useEffect(() => {
    if (isFinished) {
      setIsTracking(false);
      setCurrentStatus(undefined);
    }
  }, [isFinished]);

  useEffect(() => {
    setCurrentStatus(query.data?.status);
  }, [query.data?.status]);

  const startPolling = useCallback(() => {
    queryClient.removeQueries({ queryKey });
    setIsTracking(true);
  }, [queryClient, queryKey]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    startPolling,
    currentStatus,
  };
}