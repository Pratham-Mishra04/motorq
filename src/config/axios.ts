import axios from 'axios';
import { BACKEND_URL } from './routes';
import { getCookie } from 'cookies-next';

const configuredAxios = axios.create({ baseURL: BACKEND_URL });
configuredAxios.interceptors.request.use(
  (config) => {
    const token = getCookie('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default configuredAxios;
