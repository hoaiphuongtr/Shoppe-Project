import {
    URL_LOGIN,
    URL_LOGOUT,
    URL_REGISTER
} from 'src/components/constants/url';
import { AuthResponse } from 'src/types/auth.type';
import http from 'src/utils/http';

const authApi = {
    registerAccount(body: { email: string; password: string }) {
        return http.post<AuthResponse>(URL_REGISTER, body);
    },
    login(body: { email: string; password: string }) {
        return http.post<AuthResponse>(URL_LOGIN, body);
    },
    logout() {
        return http.post(URL_LOGOUT);
    }
};
export default authApi;
