import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { omit } from 'lodash';
import classNames from 'classnames';
import { QueryConfig } from '../ProductList';
import {
    sortBy,
    SortBy as SortByType,
    Order as OrderType,
    order as OrderConstant
} from './../../../components/constants/product';
import { path } from 'src/components/constants/path';

interface Props {
    queryConfig: QueryConfig;
    pageLimit: number;
}

export default function SortProductList({ queryConfig, pageLimit }: Props) {
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
                    <div>Sắp xếp theo</div>
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
                        Phổ biến
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
                        Mới nhất
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
                        Bán chạy
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
                            Giá
                        </option>
                        <option
                            value={OrderConstant.asc}
                            className='bg-white text-black'
                        >
                            Giá: Thấp đến cao
                        </option>
                        <option
                            value={OrderConstant.desc}
                            className='bg-white text-black'
                        >
                            Giá: Cao đến thấp
                        </option>
                    </select>
                </div>

                <div className='flex items-center'>
                    <span>{page}</span>
                    <span>/{pageLimit}</span>
                    <div className='ml-2 flex items-center'>
                        {page === 1 ? (
                            <span className='flex w-9 h-8 rounded-l-sm bg-white/30 hover:bg-slate-100 cursor-not-allowed shadow justify-center items-center'>
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
                            <span className='flex w-9 h-8 rounded-r-sm bg-white/30 hover:bg-slate-100 cursor-not-allowed shadow justify-center items-center'>
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
