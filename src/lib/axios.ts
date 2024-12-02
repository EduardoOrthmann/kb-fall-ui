import { API_BASE_URL } from '@/utils/constants';
import axios from 'axios';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const nextApi = axios.create({
  baseURL: '/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});
