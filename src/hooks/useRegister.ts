import {register} from "@src/services/register";
import {RegisterPayload, RegisterResponseError, RegisterResponseSuccess} from "@src/types/api-requests.types";
import {useState} from "react";
import {AxiosError} from "axios";

export function useRegister() {

  async function handleFn(data: RegisterPayload): Promise<string | null> {
    try {
      const response = await register.trySignUp(data);

      return response.status;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as RegisterResponseError;

        if (errorData?.message.length > 0) {
          return errorData.message[0];
        } else {
          return 'Unknown register error';
        }
      } else {
        return 'Register request error';
      }

      return null;
    }
  }

  return { handleFn };
}