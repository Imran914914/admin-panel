import axios from 'axios';
const NEXT_PUBLIC_BASEURL='http://localhost:8080'
// const NEXT_PUBLIC_BASEURL='http://94.156.177.209:8080'
const apiClient = axios.create({
  baseURL: NEXT_PUBLIC_BASEURL, // Base URL for your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
