import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import omit from 'lodash/omit';
import classNames from 'classnames';
import { QueryConfig } from 'src/hooks/useQueryConfig';
import { path } from 'src/components/constants/path';
import {
    sortBy,
    SortBy as SortByType,
    Order as OrderType,
    order as OrderConstant
} from 'src/components/constants/product';
import { useTranslation } from 'react-i18next';

interface Props {
    queryConfig: QueryConfig;
    pageLimit: number;
}

export default function SortProductList({ queryConfig, pageLimit }: Props) {
    const { t } = useTranslation('product')
    const page = Number(queryConfig.page);
    const { sort_by = sortBy.createdAt, order } = queryConfig;
    const isActiveSortBy = (sortByValue: SortByType) => {
        return sort_by === sortByValue;
    };
    const navigate = useNavigate();
    const handleSort = (sortByValue: SortByType) => {
        navigate({
            pathname: path.home,
            search: createSearchParams(
                omit(
                    {
                        ...queryConfig,
                        sort_by: sortByValue
                    },
                    ['order']
                )
            ).toString()
        });
    };
    const handlePriceOrder = (orderValue: OrderType) => {
        navigate({
            pathname: path.home,
            search: createSearchParams({
                ...queryConfig,
                sort_by: sortBy.price,
                order: orderValue
            }).toString()
        });
    };

    return (
        <div className='bg-gray-300/40 py-4 px-3'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='flex items-center flex-wrap gap-2'>
                    <div>{t('sort product.sort by')}</div>
                    <button
                        className={classNames(
                            'h-8 px-4 capitalize text-sm text-center',
                            {
                                'bg-orange text-white hover:bg-orange/80 ':
                                    isActiveSortBy(sortBy.view),
                                'bg-white text-black hover:bg-slate-100':
                                    !isActiveSortBy(sortBy.view)
                            }
                        )}
                        onClick={() => {
                            handleSort(sortBy.view);
                        }}
                    >
                        {t('sort product.popular')}
                    </button>
                    <button
                        className={classNames(
                            'h-8 px-4 capitalize text-sm text-center',
                            {
                                'bg-orange text-white hover:bg-orange/80 ':
                                    isActiveSortBy(sortBy.createdAt),
                                'bg-white text-black hover:bg-slate-100':
                                    !isActiveSortBy(sortBy.createdAt)
                            }
                        )}
                        onClick={() => {
                            handleSort(sortBy.createdAt);
                        }}
                    >
                        {t('sort product.latest')}
                    </button>
                    <button
                        className={classNames(
                            'h-8 px-4 capitalize text-sm text-center',
                            {
                                'bg-orange text-white hover:bg-orange/80 ':
                                    isActiveSortBy(sortBy.sold),
                                'bg-white text-black hover:bg-slate-100':
                                    !isActiveSortBy(sortBy.sold)
                            }
                        )}
                        onClick={() => {
                            handleSort(sortBy.sold);
                        }}
                    >
                        {t('sort product.top sales')}
                    </button>
                    <select
                        className={classNames(
                            'h-8 px-4 capitalize text-sm text-center',
                            {
                                'bg-orange text-white hover:bg-orange/80 ':
                                    isActiveSortBy(sortBy.price),
                                'bg-white text-black hover:bg-slate-100':
                                    !isActiveSortBy(sortBy.price)
                            }
                        )}
                        value={order || ''}
                        onChange={(event) =>
                            handlePriceOrder(event.target.value as OrderType)
                        }
                    >
                        <option
                            value=''
                            disabled
                            className='bg-white text-black'
                        >
                            {t('sort product.price')}
                        </option>
                        <option
                            value={OrderConstant.asc}
                            className='bg-white text-black'
                        >
                            {t('sort product.sort price.low to high')}
                        </option>
                        <option
                            value={OrderConstant.desc}
                            className='bg-white text-black'
                        >
                            {t('sort product.sort price.high to low')}

                        </option>
                    </select>
                </div>

                <div className='flex items-center'>
                    <span>{page}</span>
                    <span>/{pageLimit}</span>
                    <div className='ml-2 flex items-center'>
                        {page === 1 ? (
                            <span className='flex w-9 h-8 rounded-l-sm bg-white/30 hover:bg-slate-100 cursor-not-allowed shadow justify-center items-center' id='prevButton'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='w-3 h-3'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M15.75 19.5L8.25 12l7.5-7.5'
                                    />
                                </svg>
                            </span>
                        ) : (
                            <Link
                                to={{
                                    pathname: path.home,
                                    search: createSearchParams({
                                        ...queryConfig,
                                        page: (page - 1).toString()
                                    }).toString()
                                }}
                                className='flex w-9 h-8 rounded-l-sm bg-white hover:bg-slate-100 shadow justify-center items-center'
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='w-3 h-3'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M15.75 19.5L8.25 12l7.5-7.5'
                                    />
                                </svg>
                            </Link>
                        )}

                        {page === pageLimit ? (
                            <span className='flex w-9 h-8 rounded-r-sm bg-white/30 hover:bg-slate-100 cursor-not-allowed shadow justify-center items-center' id='nextButton'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='w-3 h-3'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M8.25 4.5l7.5 7.5-7.5 7.5'
                                    />
                                </svg>
                            </span>
                        ) : (
                            <Link
                                to={{
                                    pathname: path.home,
                                    search: createSearchParams({
                                        ...queryConfig,
                                        page: (page + 1).toString()
                                    }).toString()
                                }}
                                className='flex w-9 h-8 rounded-r-sm bg-white hover:bg-slate-100 shadow justify-center items-center'
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='w-3 h-3'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M8.25 4.5l7.5 7.5-7.5 7.5'
                                    />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
