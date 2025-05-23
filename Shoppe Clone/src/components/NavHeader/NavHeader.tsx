import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import PopOver from "src/layout/PopOver";
import { path } from "../constants/path";
import { AppContext } from "src/contexts/app.context";
import authApi from "src/apis/auth.api";
import { PurchasesStatus } from "../constants/purchase";
import { getImage } from "src/utils/utils";
import { useTranslation } from "react-i18next";

import { locales } from "src/i18n/i18n";


export default function NavHeader() {
    const { i18n, t } = useTranslation()
    const currentLanguage = locales[i18n.language as keyof typeof locales];
    const queryClient = useQueryClient()
    const { setIsAuthenticated, isAuthenticated, setProfile, profile } =
        useContext(AppContext);
    const logOutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            setIsAuthenticated(false);
            setProfile(null);
            queryClient.removeQueries({ queryKey: ['purchases', { status: PurchasesStatus.inCart }] })
        }
    });
    const handleLogOut = () => logOutMutation.mutate();
    const changeLanguage = (lg: 'en' | 'vi') => {
        i18n.changeLanguage(lg);
    }
    return (
        <div className='flex justify-end items-center text-sm'>
            <div className='flex items-center py-1 hover:text-white/70 cursor-pointer'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0'
                    />
                </svg>

                <div className='mx-1'>{t('nav header.notification')}</div>
            </div>
            <div className='flex items-center py-1 hover:text-white/70 cursor-pointer ml-3'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z'
                    />
                </svg>

                <div className='mx-1'>{t('nav header.help')}</div>
            </div>
            <PopOver
                className='flex items-center py-1 hover:text-white/70 cursor-pointer ml-3'
                placement='bottom'
                content={
                    <div className='flex flex-col py-2 pr-28 pl-3'>
                        <button className='text-left py-2 px-3 hover:text-orange' onClick={() => changeLanguage('vi')}>
                            Tiếng Việt
                        </button>
                        <button className='text-left py-2 px-3 hover:text-orange mt-2' onClick={() => changeLanguage('en')}>
                            English
                        </button>
                    </div>
                }
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
                    />
                </svg>
                <span className='mx-1'>{currentLanguage}</span>

                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                    />
                </svg>
            </PopOver>

            {isAuthenticated && (
                <PopOver
                    className='flex items-center py-1 hover:text-white/70 cursor-pointer ml-6'
                    content={
                        <div className='bg-white relative shadow-md rounded-sm border border-gray-200'>
                            <Link
                                to={path.profile}
                                className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                            >
                                {t('nav header.account')}
                            </Link>
                            <Link
                                to={path.historyPurchase}
                                className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                            >
                                {t('nav header.purchase history')}
                            </Link>
                            <button
                                onClick={handleLogOut}
                                className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                            >
                                {t('nav header.logout')}
                            </button>
                        </div>
                    }
                >
                    <div className='w-7 h-7 mx-2 flex-shrink-0'>
                        <img
                            src={getImage(profile?.avatar)}
                            alt='avatar'
                            className='w-full h-full object-cover rounded-full'
                        />
                    </div>
                    <div>{profile?.name}</div>
                </PopOver>
            )}
            {!isAuthenticated && (
                <div className='flex items-center'>
                    <Link
                        to={path.register}
                        className='mx-3 capitalize hover:text-white/70'
                    >
                        {t('nav header.register')}
                    </Link>
                    <div className='border-r-[1px] border-r-white/40 h-4 '></div>
                    <Link
                        to={path.login}
                        className='mx-3 capitalize hover:text-white/70'
                    >
                        {t('nav header.login')}
                    </Link>
                </div>
            )}
        </div>
    )
}
