import { axiosClient } from '@src/lib/axiosClient';
import { API_ROUTES } from '@src/config/api';
import {AxiosResponse} from "axios";
import {NewClassPayload} from "@src/types/api-requests.types";

export const newClass = {
  async createNewClass({token, ...data}: NewClassPayload) {
    const response:AxiosResponse = await axiosClient.post(API_ROUTES.newClass, data, {
      headers: {
        'Content-Type': undefined,
        'Authorization': `Bearer ${token}`,
      },
    });

    return response;
  }
}