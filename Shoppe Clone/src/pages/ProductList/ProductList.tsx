import { useQuery, keepPreviousData } from '@tanstack/react-query';

import productAPI from 'src/apis/product.api';
import { categoryAPI } from 'src/apis/category.api';
import { ProductListConfig } from 'src/types/product.type';

import AsideFilter from './components/AsideFilter';

import Pagination from 'src/components/Pagination';
import SortProductList from './components/SortProductList';
import Product from './components/Product';
import useQueryConfig from 'src/hooks/useQueryConfig';



export default function ProductList() {
    const queryConfig = useQueryConfig()
    const { data: productData } = useQuery({
        queryKey: ['products', queryConfig],
        queryFn: () => {
            return productAPI.getProducts(queryConfig as ProductListConfig);
        },
        placeholderData: keepPreviousData
    });
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => {
            return categoryAPI.getCategories();
        }
    });
    return (
        <div className='bg-gray-200 py-6'>
            <div className='container'>
                {productData && (
                    <div className='ml-2 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
                        </div>
                        <div className='ml-2 col-span-9'>
                            <SortProductList
                                queryConfig={queryConfig}
                                pageLimit={productData.data.data.pagination.page_size}
                            />
                            <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                                {productData.data.data.products.map((product) => (
                                    <div
                                        className='col-span-1'
                                        key={product._id}
                                    >
                                        <Product product={product} />
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                queryConfig={queryConfig}
                                pageLimit={productData.data.data.pagination.page_size}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
