import axios from 'axios';
import { BASE_URL } from "@src/config/api";

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});