import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig
} from 'axios';

import { toast } from 'react-toastify';
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type';
import {
    clearLS,
    getAccessTokenFromLS,
    getRefreshTokenFromLS,
    setAccessTokenToLS,
    setProfileToLS,
    setRefreshTokenToLS
} from './auth';
import { path } from 'src/components/constants/path';
import HttpStatusCode from 'src/components/constants/httpStatusCode.enum';
import {
    URL_LOGIN,
    URL_LOGOUT,
    URL_REFRESH_TOKEN,
    URL_REGISTER
} from 'src/components/constants/url';
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils';
import { ErrorResponseApi } from 'src/types/utils.type';

class Http {
    instance: AxiosInstance;
    private accessToken: string;
    private refreshToken: string;
    private refreshTokenRequest: Promise<string> | null;
    constructor() {
        this.accessToken = getAccessTokenFromLS(); //because getting access_token from RAM is faster than you get access_token from your localStorage which is your hard disk drive
        this.refreshToken = getRefreshTokenFromLS();
        this.refreshTokenRequest = null;
        (this.instance = axios.create({
            baseURL: 'https://api-ecom.duthanhduoc.com/',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'expire-access-token': 10,
                'expire-refresh-token': 60 * 60
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
                if (url === URL_LOGIN || url === URL_REGISTER) {
                    const data = response.data as AuthResponse;
                    this.accessToken = data.data.access_token;
                    this.refreshToken = data.data.refresh_token;
                    setAccessTokenToLS(this.accessToken);
                    setRefreshTokenToLS(this.refreshToken);
                    setProfileToLS(data.data.user);
                } else if (url === URL_LOGOUT) {
                    this.accessToken = '';
                    this.refreshToken = '';
                    clearLS();
                }
                return response;
            },
            (error: AxiosError) => {
                if (
                    ![
                        HttpStatusCode.UnprocessableEntity,
                        HttpStatusCode.Unauthorized
                    ].includes(error.response?.status as number)
                ) {
                    const data: any | undefined = error.response?.data;
                    const message = data?.message || error.message;
                    toast.error(message);
                }
                if (
                    isAxiosUnauthorizedError<
                        ErrorResponseApi<{ name: string; message: string }>
                    >(error)
                ) {
                    const config =
                        error.response?.config ||
                        ({ headers: {} } as InternalAxiosRequestConfig);
                    const { url } = config;
                    if (
                        isAxiosExpiredTokenError(error) &&
                        url !== URL_REFRESH_TOKEN
                    ) {
                        this.refreshTokenRequest = this.refreshTokenRequest
                            ? this.refreshTokenRequest
                            : this.handleRefreshToken().finally(() => {
                                  setTimeout(() => {
                                      this.refreshTokenRequest = null;
                                  }, 10000);
                              });
                        return this.refreshTokenRequest.then((access_token) => {
                            return this.instance({
                                ...config,
                                headers: {
                                    ...config.headers,
                                    Authorization: access_token
                                }
                            });
                        });
                    }
                    clearLS();
                    this.accessToken = '';
                    this.refreshToken = '';
                    toast.error(
                        error.response?.data.data?.message ||
                            error.response?.data.message
                    );
                }
                return Promise.reject(error);
            }
        );
    }
    private handleRefreshToken() {
        return this.instance
            .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
                refresh_token: this.refreshToken
            })
            .then((res) => {
                const { access_token } = res.data.data;
                setAccessTokenToLS(access_token);
                this.accessToken = access_token;
                return access_token;
            })
            .catch((error) => {
                clearLS();
                this.accessToken = '';
                this.refreshToken = '';
                throw error;
            });
    }
}
const http = new Http().instance;
export default http;
