import {register} from "@src/services/register";
import {RegisterPayload} from "@src/types/api-requests.types";
import {AxiosResponse, isAxiosError} from "axios";

interface RegisterResponse {
  response: AxiosResponse | null;
  message: string;
}

export function useRegister() {

  async function handleFn(data: RegisterPayload): Promise<RegisterResponse> {
    try {
      const response:AxiosResponse = await register.trySignUp(data);

      if (response.data.status === "USER_ADDED") {
        return {response, message: 'Successfully registered'};
      }

      if (response.data.status === "USER_ALREADY_EXISTS") {
        return {response, message: 'User already exists'};
      }

      throw new Error("Unknown success status");

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

  return { handleFn };
}