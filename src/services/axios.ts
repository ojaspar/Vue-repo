import axios from 'axios';

import sessionStorageService from '@/services/sessionStorage';
import AuthenticationService from '@/services/authentication';

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        accept: 'Accept: application/json',
    },
});

axiosInstance.interceptors.request.use(
    config => {
        const token = sessionStorageService.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            const currentTimeInMilliseconds = Math.floor(Date.now() / 1000);
            const decodededToken = sessionStorageService.decodeToken();
            //TODO Instead of logging out our users, we should do a refresh token here or pop up a screen to reauthenticate
            if (currentTimeInMilliseconds > decodededToken.exp) {
                AuthenticationService.logoutUser();
            }
        }

        return config;
    },
    error => Promise.reject(error),
);

export default axiosInstance;
