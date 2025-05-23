import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import authApi from './../../apis/auth.api';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import { path } from 'src/components/constants/path';
import { ErrorResponseApi } from 'src/types/utils.type';
import { isAxiosUnprocessableEntityError } from 'src/utils/utils';
import { Schema, schema } from 'src/utils/rules';
import { AppContext } from 'src/contexts/app.context';

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(loginSchema)
    });
    const { setIsAuthenticated, setProfile } = useContext(AppContext);
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: (body: FormData) => authApi.login(body)
    });
    const onSubmit = handleSubmit((data) => {
        loginMutation.mutate(data, {
            onSuccess: (data) => {
                setIsAuthenticated(true);
                setProfile(data.data.data.user);
                navigate(path.home);
            },
            onError: (error) => {
                if (
                    isAxiosUnprocessableEntityError<
                        ErrorResponseApi<FormData>
                    >(error)
                ) {
                    const errorForm = error.response?.data.data;
                    if (errorForm) {
                        Object.keys(errorForm).forEach((key) => {
                            setError(key as keyof FormData, {
                                message: errorForm[key as keyof FormData],
                                type: 'Server'
                            });
                        });
                    }
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
                            <div className='text-2xl'>Đăng nhập</div>
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
                            <div className='mt-3'>
                                <Button
                                    type='submit'
                                    className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600
                                    flex justify-center items-center'
                                    isLoading={loginMutation.isPending}
                                    disabled={loginMutation.isPending}
                                >
                                    Đăng nhập
                                </Button>
                            </div>
                            <div className='flex items-center justify-center mt-8'>
                                <span className='text-gray-400'>
                                    Bạn chưa có tài khoản?
                                </span>
                                <Link
                                    className='text-red-400 ml-1'
                                    to={path.register}
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
