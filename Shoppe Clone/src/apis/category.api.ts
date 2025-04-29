import { SuccessResponseApi } from 'src/types/utils.type';
import http from './../utils/http';
import { Category } from 'src/types/category.type';
const URL = 'categories';
export const categoryAPI = {
    getCategories() {
        return http.get<SuccessResponseApi<Category[]>>(URL)
    }
}