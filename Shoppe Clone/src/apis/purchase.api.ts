import http from 'src/utils/http';
import { PurchaseListStatus, PurchaseType } from 'src/types/purchase.type';
import { SuccessResponseApi } from 'src/types/utils.type';
export type AddToCartType = {
    product_id: string;
    buy_count: number;
};
const URL = 'purchases';
const purchaseAPI = {
    addToCart(body: AddToCartType) {
        return http.post<SuccessResponseApi<PurchaseType>>(
            `${URL}/add-to-cart`,
            body
        );
    },
    getPurchaseList(params: { status: PurchaseListStatus }) {
        return http.get<SuccessResponseApi<PurchaseType[]>>(`${URL}`, {
            params
        });
    }
};
export default purchaseAPI;
