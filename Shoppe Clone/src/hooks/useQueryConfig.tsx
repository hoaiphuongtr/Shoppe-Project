import useQueryParams from 'src/hooks/useQueryParams';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import { ProductListConfig } from 'src/types/product.type';
export type QueryConfig = {
    [key in keyof ProductListConfig]: string;
};
export default function useQueryConfig() {
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
            category: queryParams.category
        },
        isUndefined
    );
    return queryConfig
}
