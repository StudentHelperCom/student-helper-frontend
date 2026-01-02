import { axiosClient } from '@src/lib/axiosClient';
import { API_ROUTES } from '@src/config/api';
import {UploadPayload} from "@src/types/api-requests.types";
import {AxiosResponse} from "axios";

export const cdn = {
  async uploadFile({files, className, token}: UploadPayload) {
    const formData = new FormData();

    formData.append('className', className);

    files.forEach((file) => {
      formData.append('files', file);
    });

    const response:AxiosResponse = await axiosClient.post(API_ROUTES.upload, formData, {
      headers: {
        'Content-Type': undefined,
        'Authorization': `Bearer ${token}`,
      },
    });

    return response;
  },
};