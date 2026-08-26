import axios from 'axios';

const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
