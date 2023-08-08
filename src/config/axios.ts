import axios from 'axios';
import { BACKEND_URL } from './routes';

const configuredAxios = axios.create({ baseURL: BACKEND_URL });

export default configuredAxios;
