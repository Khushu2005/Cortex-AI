import axios from 'axios';


const BASE_URL = 
import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` // 
  : 
  'http://localhost:3000/api';      

const api = axios.create({
    baseURL: BASE_URL, 
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

export default api;