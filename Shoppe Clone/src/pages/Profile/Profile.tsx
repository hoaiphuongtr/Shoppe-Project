import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, Resolver, useForm, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import userAPI, { BodyUpdateProfile } from "src/apis/user.api";
import Button from "src/components/Button";
import Input from "src/components/Input";
import InputNumber from "src/components/InputNumber";
import { UserSchema, userSchema } from "src/utils/rules";
import DateSelect from "../User/components/DateSelect";
import { ErrorResponseApi, SuccessResponseApi } from "src/types/utils.type";
import { User } from "src/types/user.type";
import { AppContext } from "src/contexts/app.context";
import { setProfileToLS } from "src/utils/auth";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";
import InputFile from "src/components/InputFile";

type ProfileFormData = Pick<UserSchema, 'name' | 'phone' | 'address' | 'date_of_birth' | 'avatar'>
type ProfileFormDataError = Omit<ProfileFormData, 'date_of_birth'> & {
    'date_of_birth': string
}
const profileSchema = userSchema.pick(['name', 'phone', 'address', 'date_of_birth', 'avatar']);


function Infor() {
    const { register, formState: { errors }, control } = useFormContext<ProfileFormData>()
    return (
        <Fragment>
            <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
                <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
                <div className='sm:w-[80%] sm:pl-5'>
                    <Input classNameInput='w-full rounded-sm border border-gray-300 px-3 py-3 outline-none focus:border-gray-500 focus:shadow-sm' register={register} errorMessage={errors.name?.message} placeholder="Tên" name="name" />
                </div>
            </div>
            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
                <div className='sm:w-[80%] sm:pl-5'>
                    <Controller control={control} name="phone"
                        render={({ field: { onChange, value } }) => (
                            <InputNumber classNameInput='w-full rounded-sm border border-gray-300 px-3 py-3 outline-none focus:border-gray-500 focus:shadow-sm' placeholder="Số điện thoại" onChange={onChange}
                                errorMessage={errors.phone?.message} value={value} />
                        )} />
                </div>
            </div>
            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ</div>
                <div className='sm:w-[80%] sm:pl-5'>
                    <Input classNameInput='w-full rounded-sm border border-gray-300 px-3 py-3 outline-none focus:border-gray-500 focus:shadow-sm' register={register} errorMessage={errors.name?.message} placeholder="Địa chỉ" name="address" />
                </div>
            </div>
            <Controller control={control} name='date_of_birth' render={({ field: { onChange, value } }) =>
            (
                <DateSelect errorMessage={errors.date_of_birth?.message} onChange={onChange} value={value} />
            )
            } />
        </Fragment>
    )
}


export default function Profile() {
    const [file, setFile] = useState<File>()
    const { setProfile } = useContext(AppContext)

    const previewImage = useMemo(() => {
        return file ? URL.createObjectURL(file) : ''
    }, [file]) //khi có 1 giá trị phụ thuộc vào giá trị khác thì ta nên khai báo biến hơn là khai báo state 
    const { data: profileData, refetch } = useQuery({
        queryKey: ['profile'],
        queryFn: userAPI.getProfile
    })
    const methods = useForm<ProfileFormData>({
        defaultValues: {
            name: '',
            phone: '',
            address: '',
            avatar: '',
            date_of_birth: new Date('1990-01-01')
        },
        resolver: yupResolver(profileSchema) as Resolver<ProfileFormData, any>
    })
    const { handleSubmit, setError, setValue, watch } = methods
    const avatar = watch('avatar')
    const profile = profileData?.data.data
    const updateProfileMutation = useMutation<SuccessResponseApi<User>, Error, BodyUpdateProfile>({
        mutationFn: async (body) => {
            const response = await userAPI.updateProfile(body);
            return response.data;
        }
    });
    const uploadAvatarMutation = useMutation<SuccessResponseApi<string>, Error, FormData>({
        mutationFn: async (formData) => {
            const res = await userAPI.uploadAvatar(formData)
            return res.data
        }
    }
    )

    useEffect(() => {
        if (profile) {
            setValue('address', profile.address)
            setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date('1990-01-01'))
            setValue('avatar', profile.avatar)
            setValue('name', profile.name)
            setValue('phone', profile.phone)
        }
    }, [profile, setValue])
    const onSubmit = handleSubmit(async (data) => {
        try {
            let avatarName = avatar
            if (file) {
                const form = new FormData()
                form.append('image', file)
                const uploadRes = await uploadAvatarMutation.mutateAsync(form)
                avatarName = uploadRes.data
                console.log(avatarName)
                setValue('avatar', avatarName)
            }
            const res = await updateProfileMutation.mutateAsync({
                ...data,
                date_of_birth: data.date_of_birth?.toISOString(),
                avatar: avatarName
            })
            setProfile(res.data)
            setProfileToLS(res.data)
            refetch()
            toast.success(res.message)

        } catch (error) {
            if (
                isAxiosUnprocessableEntityError<
                    ErrorResponseApi<ProfileFormDataError>
                >(error)
            ) {
                const errorForm = error.response?.data.data;
                if (errorForm) {
                    Object.keys(errorForm).forEach((key) => {
                        setError(
                            key as keyof ProfileFormDataError,
                            {
                                message:
                                    errorForm[
                                    key as keyof ProfileFormDataError
                                    ],
                                type: 'Server'
                            }
                        );
                    });
                }
            }
        }
    })
    const handleChangeFile = (file?: File) => {
        setFile(file)
    }
    return (
        <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
            <div className='border-b border-b-gray-200 py-6'>
                <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
                <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
            </div>
            <FormProvider {...methods}>
                <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
                    <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
                        <div className='flex flex-col flex-wrap sm:flex-row'>
                            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
                            <div className='sm:w-[80%] sm:pl-5'>
                                <div className='pt-3 text-gray-700'>{profile?.email}</div>
                            </div>
                        </div>
                        <Infor />
                        <div className='mt-4 flex flex-col flex-wrap sm:flex-row'>
                            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
                            <div className="sm:w-[80%] sm:pl-5">
                                <Button className="h-9 mx-auto flex items-center justify-center bg-orange px-5 text-sm text-center text-white hover:bg-orange/80 rounded-sm" type='submit'>
                                    Lưu
                                </Button>
                            </div>

                        </div>
                    </div>
                    <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
                        <div className='flex flex-col items-center'>
                            <div className='my-5 h-24 w-24'>
                                <img
                                    src={previewImage || avatar}
                                    alt=''
                                    className='w-full h-full rounded-full object-cover cursor-pointer'
                                />
                            </div>
                            <InputFile onChange={handleChangeFile} />
                            <div className='mt-3 text-gray-400'>
                                <div>Dụng lượng file tối đa 1 MB</div>
                                <div>Định dạng:.JPEG, .PNG</div>
                            </div>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}
