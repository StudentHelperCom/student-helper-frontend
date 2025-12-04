import { axiosClient } from '@src/lib/axiosClient';
import { API_ROUTES } from '@src/config/api';
import {RegisterPayload, RegisterResponseSuccess} from "@src/types/api-requests.types";
import {AxiosResponse} from "axios";

export const register = {
  async trySignUp(data: RegisterPayload) {
    const response:AxiosResponse = await axiosClient.post<RegisterResponseSuccess>(API_ROUTES.register, data);

    return response;
  }
}