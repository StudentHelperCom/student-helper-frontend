import { axiosClient } from '@src/lib/axiosClient';
import { API_ROUTES } from '@src/config/api';
import {LoginPayload, LoginResponseSuccess} from "@src/types/api-requests.types";
import {useLoader} from "@components/contexts/LoaderContext";

export const login = {
  async trySignIn(data: LoginPayload) {

    const response = await axiosClient.post<LoginResponseSuccess>(API_ROUTES.login, data);

    return response.data;
  }
}