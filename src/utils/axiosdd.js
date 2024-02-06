import axios from 'axios';

// const axiosServices = axios.create();

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //


const axiosServices = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  withCredentials: true, // Important for handling cookies
});

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;