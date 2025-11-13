import { axiosClient } from '@src/lib/axiosClient';
import { API_ROUTES } from '@src/config/api';
import {RegisterPayload, RegisterResponseSuccess} from "@src/types/api-requests.types";

export const register = {
  async trySignUp(data: RegisterPayload) {
    const response = await axiosClient.post<RegisterResponseSuccess>(API_ROUTES.register, data);

    return response.data;
  }
}