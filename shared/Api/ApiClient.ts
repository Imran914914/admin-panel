import axios from 'axios';
const BaseUrl=process.env.NEXT_PUBLIC_BASEURL

const apiClient = axios.create({
  baseURL: BaseUrl, // Base URL for your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
