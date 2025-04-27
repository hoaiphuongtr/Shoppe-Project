import classNames from 'classnames';
import { Link, createSearchParams } from 'react-router-dom';
import { QueryConfig } from 'src/pages/ProductList/ProductList';
import { path } from '../constants/path';
interface Props {
    queryConfig: QueryConfig;
    pageLimit: number;
}
const RANGE = 2;
export default function Pagination({ queryConfig, pageLimit }: Props) {
    const page = Number(queryConfig.page);
    const renderPagination = () => {
        let hasRenderedDot = false;

        return Array.from({ length: pageLimit }, (_, index) => {
            const pageNumber = index + 1;
            const isNearCurrent = Math.abs(page - pageNumber) <= RANGE;
            const isEdgePage = pageNumber <= 2 || pageNumber > pageLimit - 2;

            if (isEdgePage || isNearCurrent) {
                hasRenderedDot = false;
                return (
                    <Link
                        to={{
                            pathname: path.home,
                            search: createSearchParams({
                                ...queryConfig,
                                page: pageNumber.toString()
                            }).toString()
                        }}
                        key={pageNumber}
                        className={classNames(
                            'bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border',
                            {
                                'border-cyan-500': page === pageNumber,
                                'border-transparent': page !== pageNumber
                            }
                        )}
                    >
                        {pageNumber}
                    </Link>
                );
            } else if (!hasRenderedDot) {
                hasRenderedDot = true;
                return (
                    <span
                        key={`dot-${pageNumber}`}
                        className='bg-white rounded px-3 py-2 shadow-sm mx-2 border'
                    >
                        ...
                    </span>
                );
            }
            return null;
        });
    };

    return (
        <div className='flex flex-wrap mt-6 justify-center'>
            {page === 1 ? (
                <span className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-not-allowed border bg-white/60'>
                    Prev
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
                    className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border'
                >
                    Prev
                </Link>
            )}

            {renderPagination()}
            {page === pageLimit ? (
                <span className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-not-allowed border bg-white/60'>
                    Next
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
                    className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border'
                >
                    Next
                </Link>
            )}
        </div>
    );
}
