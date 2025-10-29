import { axiosClient } from '@src/lib/axiosClient';
import { API_ROUTES } from '@src/config/api';

export const cdn = {
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post(API_ROUTES.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};