import { Link } from 'react-router-dom';
import { Product as ProductType } from 'src/types/product.type';

import ProductRating from 'src/components/ProductRating';
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils';
import { path } from 'src/components/constants/path';
interface Props {
    product: ProductType;
}
export default function Product({ product }: Props) {
    return (
        <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
            <div className='bg-white shadow rounded-sm hover:translate-y-[-0.04rem] hover:shadow-md duration-100 transition-transform overflow-hidden'>
                <div className='w-full pt-[100%] relative'>
                    <img
                        src={product.image}
                        alt={product.name}
                        className='absolute top-0 left-0 bg-white w-full h-full object-cover'
                    />
                </div>
                <div className='p-2 overflow-hidden'>
                    <div className='min-h-[2rem] line-clamp-2 text-xs'>
                        {product.name}
                    </div>
                    <div
                        className='box-border flex space-x-1 h-5 text-sp10 items-center self-auto overflow-hidden text-xs'
                        aria-hidden='true'
                    >
                        <div className='w-auto'>
                            <div className='relative flex items-center text-sp10 leading-4 py-0.5 px-1 h-4 pointer-events-none text-ellipsis overflow-hidden max-w-full m-px shadow-[0px_0px_0px_0.5px_rgb(238,77,45)] rounded-[0.5px]'>
                                <span className='truncate text-[rgb(238,77,45)]'>
                                    Rẻ Vô Địch
                                </span>
                            </div>
                        </div>
                        <div className='w-auto'>
                            <div className='h-4 pointer-events-none text-ellipsis overflow-hidden max-w-full flex flex-row justify-start items-stretch'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='-0.5 -0.5 4 16'
                                    className='flex-none h-full -mr-px stoke-yellow fill-yellow'
                                >
                                    <path
                                        d='M4 0h-3q-1 0 -1 1a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3q0 1 1 1h3'
                                        strokeWidth='1'
                                    />
                                </svg>
                                <div className='truncate bg-[rgb(246,145,19)] text-white leading-4 text-sp10 px-px'>
                                    Giảm ₫1k
                                </div>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='-0.5 -0.5 4 16'
                                    className='rotate-180 flex-none h-full -ml-px'
                                >
                                    <path
                                        d='M4 0h-3q-1 0 -1 1a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3q0 1 1 1h3'
                                        strokeWidth='1'
                                        stroke='#F69113'
                                        fill='#F69113'
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center mt-3'>
                        <div className='line-through max-w-[50%] text-gray-500 truncate'>
                            <span className='text-sm'>₫</span>
                            <span className='text-sm'>
                                {formatCurrency(product.price_before_discount)}
                            </span>
                        </div>
                        <div className='text-orange truncate ml-1'>
                            <span className='text-sm'>₫</span>
                            <span className='text-sm'>
                                {formatCurrency(product.price)}
                            </span>
                        </div>
                    </div>
                    <div className='mt-3 flex items-center justify-end'>
                        <ProductRating rating={product.rating} />
                        <div className='ml-2 text-sm'>
                            <span className='mr-1'>Đã bán</span>
                            <span>
                                {formatNumberToSocialStyle(product.sold)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
