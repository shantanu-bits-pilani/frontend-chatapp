import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5003/api', // Update with your gateway service URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    config => {
        const userId = localStorage.getItem('loggedInUserId');
        const username = localStorage.getItem('loggedInUserName');
        if (userId) {
            config.headers['X-Logged-In-User'] = userId;
            config.headers['X-Logged-In-UserName'] = username;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;