import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { omit } from "lodash";

import { Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import userAPI, { BodyUpdateProfile } from "src/apis/user.api";
import Button from "src/components/Button";
import Input from "src/components/Input";
import { User } from "src/types/user.type";
import { ErrorResponseApi, SuccessResponseApi } from "src/types/utils.type";
import { userSchema, UserSchema } from "src/utils/rules";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password']);
export default function ChangePassword() {
    const { setError, register, formState: { errors }, handleSubmit, reset } = useForm<FormData>({
        defaultValues: {
            password: '',
            new_password: '',
            confirm_password: '',
        },
        resolver: yupResolver(passwordSchema) as Resolver<FormData, any>
    })
    const updateProfileMutation = useMutation<SuccessResponseApi<User>, Error, BodyUpdateProfile>({
        mutationFn: async (body) => {
            const response = await userAPI.updateProfile(body);
            return response.data;
        }
    });
    const onSubmit = handleSubmit(async (data) => {
        try {
            const cleanData = omit(data, ['confirm_password'])
            const res = await updateProfileMutation.mutateAsync(cleanData)
            toast.success(res.message)
            reset()

        } catch (error) {
            if (
                isAxiosUnprocessableEntityError<
                    ErrorResponseApi<FormData>
                >(error)
            ) {
                const errorForm = error.response?.data.data;
                if (errorForm) {
                    Object.keys(errorForm).forEach((key) => {
                        setError(
                            key as keyof FormData,
                            {
                                message:
                                    errorForm[
                                    key as keyof FormData
                                    ],
                                type: 'Server'
                            }
                        );
                    });
                }
            }
        }
    })
    return (
        <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
            <div className='border-b border-b-gray-200 py-6'>
                <h1 className='text-lg font-medium capitalize text-gray-900'>Đổi mật khẩu</h1>
                <div className='mt-1 text-base text-gray-700'>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</div>
            </div>

            <form className='mt-8 mr-auto max-w-2xl' onSubmit={onSubmit}>
                <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
                    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu cũ</div>
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Input classNameInput=' w-full rounded-sm border border-gray-300 px-3 py-3 outline-none focus:border-gray-500 focus:shadow-sm' register={register} errorMessage={errors.password?.message} placeholder="Mật khẩu cũ" name="password" type='password' className="relative" />
                        </div>
                    </div>
                    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu mới</div>
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Input classNameInput='w-full rounded-sm border border-gray-300 px-3 py-3 outline-none focus:border-gray-500 focus:shadow-sm' register={register} errorMessage={errors.new_password?.message} placeholder="Mật khẩu mới" name="new_password" type='password' className="relative" />
                        </div>
                    </div>
                    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Nhập lại mật khẩu</div>
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Input classNameInput='w-full rounded-sm border border-gray-300 px-3 py-3 outline-none focus:border-gray-500 focus:shadow-sm' register={register} errorMessage={errors.confirm_password?.message} placeholder="Nhập lại mật khẩu" name="confirm_password" type='password' className="relative" />
                        </div>
                    </div>

                    <div className='mt-4 flex flex-col flex-wrap sm:flex-row'>
                        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
                        <div className="sm:w-[80%] sm:pl-5">
                            <Button className="h-9 mx-auto flex items-center justify-center bg-orange px-5 text-sm text-center text-white hover:bg-orange/80 rounded-sm" type='submit'>
                                Lưu
                            </Button>
                        </div>

                    </div>
                </div>

            </form>

        </div>
    )

}
