import { RegisterOptions, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Input from 'src/components/Input';
import { getRules } from 'src/utils/rules';

export interface FormData {
    email: string;
    password: string;
    confirm_password: string;
}
export default function Register() {
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        formState: { errors }
    } = useForm<FormData>();
    const onSubmit = handleSubmit((data) => {
        console.log(data);
    });
    const rules = getRules(getValues);
    console.log(errors);
    console.log(watch());
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
                                rules={rules.email}
                                type='email'
                                autoComplete='on'
                                errorMessage={errors.email?.message}
                            />
                            <Input
                                className='mt-2'
                                name='password'
                                placeholder='Password'
                                register={register}
                                rules={rules.password}
                                type='password'
                                autoComplete='on'
                                errorMessage={errors.password?.message}
                            />

                            <Input
                                className='mt-2'
                                name='confirm_password'
                                placeholder='Confirm Password'
                                register={register}
                                rules={rules.confirm_password}
                                type='password'
                                autoComplete='on'
                                errorMessage={errors.confirm_password?.message}
                            />
                            <div className='mt-2'>
                                <button
                                    type='submit'
                                    className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                                >
                                    Đăng ký
                                </button>
                            </div>
                            <div className='flex items-center justify-center mt-8'>
                                <span className='text-gray-400'>
                                    Bạn đã có tài khoản?
                                </span>
                                <Link className='text-red-400 ml-1' to='/login'>
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
