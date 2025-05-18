import { User } from 'src/types/user.type';
import { SuccessResponseApi } from 'src/types/utils.type';
import http from 'src/utils/http';
export interface BodyUpdateProfile
    extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
    password?: string;
    newPassword?: string;
}

const userAPI = {
    getProfile() {
        return http.get<SuccessResponseApi<User>>('me');
    },
    updateProfile(body: BodyUpdateProfile) {
        return http.put<SuccessResponseApi<User>>('user', body);
    },
    uploadAvatar(body: FormData) {
        return http.post<SuccessResponseApi<string>>(
            'user/upload-avatar',
            body,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    }
};

export default userAPI;
