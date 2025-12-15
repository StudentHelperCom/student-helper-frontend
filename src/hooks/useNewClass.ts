import {AxiosResponse, isAxiosError} from "axios";
import {newClass} from "@src/services/newClass";
import {NewClassPayload} from "@src/types/api-requests.types";

interface newClassResponse {
  response: AxiosResponse | null;
  message: string;
}

export function useNewClass() {

  async function createNewClass(newClassPayload: NewClassPayload): Promise<newClassResponse> {
    try {
      const response: AxiosResponse = await newClass.createNewClass(newClassPayload);

      return { response, message: 'Successfully created' };
    } catch (err) {
      if (isAxiosError(err)) {

        if (err.response) {
          console.error('Server error:', err.response.status);

          return {
            response: null,
            message: err.response.data?.message || "Server error",
          };
        }

        if (err.request) {
          console.error('No response:', err.request);

          return {
            response: null,
            message: "Server connection error, check your internet",
          };
        }

        return {
          response: null,
          message: "Error request configuration.",
        }
      }

      if (err instanceof Error) {
        return {
          response: null,
          message: err.message,
        }
      }

      return {
        response: null,
        message: "Unknown error",
      }
    }
  }

  return { createNewClass };
}