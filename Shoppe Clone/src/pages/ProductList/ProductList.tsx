import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { omitBy, isUndefined } from 'lodash';
import productAPI from 'src/apis/product.api';
import { categoryAPI } from 'src/apis/category.api';
import { ProductListConfig } from 'src/types/product.type';
import useQueryParams from 'src/hooks/useQueryParams';
import AsideFilter from './AsideFilter';
import Product from './Product';
import SortProductList from './SortProductList';
import Pagination from 'src/components/Pagination';


export type QueryConfig = {
    [key in keyof ProductListConfig]: string;
};
export default function ProductList() {
    const queryParams: QueryConfig = useQueryParams();
    const queryConfig: QueryConfig = omitBy(
        {
            page: queryParams.page || '1',
            exclude: queryParams.exclude,
            limit: queryParams.limit,
            name: queryParams.name,
            order: queryParams.order,
            price_max: queryParams.price_max,
            price_min: queryParams.price_min,
            rating_filter: queryParams.rating_filter,
            sort_by: queryParams.sort_by,
            category : queryParams.category
        },
        isUndefined
    );
    const { data : productData } = useQuery({
        queryKey: ['products', queryConfig],
        queryFn: () => {
            return productAPI.getProducts(queryConfig as ProductListConfig);
        },
        placeholderData: keepPreviousData
    });
    const { data : categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => {
            return categoryAPI.getCategories();
        }
    });
    console.log(queryConfig);
    return (
        <div className='bg-gray-200 py-6'>
            <div className='container'>
                {productData && (
                    <div className='ml-2 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <AsideFilter queryConfig={queryConfig} categories = {categoriesData?.data.data || []}/>
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
