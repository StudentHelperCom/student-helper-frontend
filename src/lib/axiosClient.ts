import axios from 'axios';
import { getSession } from 'next-auth/react';
import { BASE_URL } from "@src/config/api";

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.user?.backendToken) {
      config.headers.Authorization = `Bearer ${session.user.backendToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);