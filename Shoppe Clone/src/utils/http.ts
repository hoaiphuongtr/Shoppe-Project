import axios, { AxiosError, AxiosInstance } from 'axios';

import { toast } from 'react-toastify';
import { AuthResponse } from 'src/types/auth.type';
import {
    clearLS,
    getAccessTokenFromLS,
    setAccessTokenToLS,
    setProfileToLS
} from './auth';
import { path } from 'src/components/constants/path';

class Http {
    instance: AxiosInstance;
    private accessToken: string;
    constructor() {
        this.accessToken = getAccessTokenFromLS(); //because getting access_token from RAM is faster than you get access_token from your localStorage which is your hard disk drive
        (this.instance = axios.create({
            baseURL: 'https://api-ecom.duthanhduoc.com/',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        })),
            this.instance.interceptors.request.use(
                (config) => {
                    if (this.accessToken && config.headers) {
                        config.headers.Authorization = this.accessToken;
                    }
                    return config;
                },
                (error) => {
                    return Promise.reject(error);
                }
            );
        this.instance.interceptors.response.use(
            (response) => {
                const { url } = response.config;
                if (url === path.login || url === path.register) {
                    const data = response.data as AuthResponse;
                    this.accessToken = data.data?.access_token;
                    setAccessTokenToLS(this.accessToken);
                    setProfileToLS(data.data.user);
                } else if (url === path.logout) {
                    this.accessToken = '';
                    clearLS();
                }
                return response;
            },
            function (error: AxiosError) {
                const data: any | undefined = error.response?.data;
                const message = data.message || error.message;
                toast.error(message);
                return Promise.reject(error);
            }
        );
    }
}
const http = new Http().instance;
export default http;
