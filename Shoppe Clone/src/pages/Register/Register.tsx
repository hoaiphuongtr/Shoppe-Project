import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { omit } from 'lodash';
import authApi from './../../apis/auth.api';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import { path } from 'src/components/constants/path';
import { schema, Schema } from 'src/utils/rules';
import { isAxiosUnprocessableEntityError } from 'src/utils/utils';
import { ErrorResponseApi } from 'src/types/utils.type';
import { AppContext } from 'src/contexts/app.context';

type FormData = Pick<Schema,'confirm_password'|'password'|'email'>;
const registerSchema = schema.pick(['confirm_password','email','password'])

export default function Register() {
    const { setProfile } = useContext(AppContext);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(registerSchema)
    });
    const registerAccountMutation = useMutation({
        mutationFn: (body: Omit<FormData, 'confirm_password'>) =>
            authApi.registerAccount(body)
    });
    const navigate = useNavigate();
    const onSubmit = handleSubmit((data) => {
        const body = omit(data, ['confirm_password']);
        registerAccountMutation.mutate(body, {
            onSuccess: (data) => {
                setProfile(data.data.data.user);
                navigate(path.login, { replace: true });
            },
            onError: (error) => {
                if (
                    isAxiosUnprocessableEntityError<
                        ErrorResponseApi<Omit<FormData, 'confirm_password'>>
                    >(error)
                ) {
                    const errorForm = error.response?.data.data;
                    if (errorForm) {
                        Object.keys(errorForm).forEach((key) => {
                            setError(
                                key as keyof Omit<FormData, 'confirm_password'>,
                                {
                                    message:
                                        errorForm[
                                            key as keyof Omit<
                                                FormData,
                                                'confirm_password'
                                            >
                                        ],
                                    type: 'Server'
                                }
                            );
                        });
                    }
                    // if (errorForm?.email) {
                    //     setError('email', {
                    //         message: errorForm.email,
                    //         type: 'Server'
                    //     });
                    // }
                    // if (errorForm?.password) {
                    //     setError('password', {
                    //         message: errorForm.password,
                    //         type: 'Server'
                    //     });
                    // }
                }
            }
        });
    });

    return (
        <div className='bg-orange'>
            <div className='container'>
                <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
                    <div className='lg:col-span-2 lg:col-start-4'>
                        <form
                            className='p-10 rounded bg-white shadow-sm'
                            onSubmit={onSubmit}
                            noValidate
                        >
                            <div className='text-2xl'>Đăng ký</div>
                            <Input
                                className='mt-8'
                                name='email'
                                placeholder='Email'
                                register={register}
                                type='email'
                                autoComplete='on'
                                errorMessage={errors.email?.message}
                            />
                            <Input
                                className='mt-2'
                                name='password'
                                placeholder='Password'
                                register={register}
                                type='password'
                                autoComplete='on'
                                errorMessage={errors.password?.message}
                            />

                            <Input
                                className='mt-2'
                                name='confirm_password'
                                placeholder='Confirm Password'
                                register={register}
                                type='password'
                                autoComplete='on'
                                errorMessage={errors.confirm_password?.message}
                            />
                            <div className='mt-2'>
                                <Button
                                    type='submit'
                                    className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex justify-center items-center'
                                    isLoading={
                                        registerAccountMutation.isPending
                                    }
                                    disabled={registerAccountMutation.isPending}
                                >
                                    Đăng ký
                                </Button>
                            </div>
                            <div className='flex items-center justify-center mt-8'>
                                <span className='text-gray-400'>
                                    Bạn đã có tài khoản?
                                </span>
                                <Link
                                    className='text-red-400 ml-1'
                                    to={path.login}
                                >
                                    Đăng nhập
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
