import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import { createSearchParams, Link } from "react-router-dom"
import purchaseAPI from "src/apis/purchase.api"
import { path } from "src/components/constants/path"
import { PurchasesStatus } from "src/components/constants/purchase"
import useQueryParams from "src/hooks/useQueryParams"
import { PurchaseListStatus } from "src/types/purchase.type"
import { formatCurrency, generateNameId } from "src/utils/utils"

const purchaseTab = [
    { status: PurchasesStatus.all, name: 'Tất cả' },
    { status: PurchasesStatus.waitforConfirmation, name: 'Chờ thanh toán' },
    { status: PurchasesStatus.beingGotten, name: 'Vận chuyển' },
    {
        status: PurchasesStatus.beingDelivered, name:
            'Chờ giao hàng'
    },
    {
        status: PurchasesStatus.delivered, name: 'Hoàn thành'
    }, {
        status: PurchasesStatus.cancelled, name: 'Đã hủy'
    }
]

export default function HistoryPurchase() {
    const queryParams: { status?: string } = useQueryParams()
    const status: number = Number(queryParams.status) || PurchasesStatus.all
    const renderPurchaseTabLink = purchaseTab.map(purchase => (
        <Link to={{
            pathname: path.historyPurchase,
            search: createSearchParams({
                status: String(purchase.status)
            }).toString()
        }} key={purchase.status} className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
            'border-b-orange text-orange': status === purchase.status,
            'border-b-black/10 text-gray-900': status !== purchase.status
        })}>{purchase.name}</Link>
    ))
    const queryKey = ['purchases', { status }]
    const { data: purchaseListInCartData } = useQuery({
        queryKey: queryKey,
        queryFn: () => purchaseAPI.getPurchaseList({ status: status as PurchaseListStatus }),

    })
    const showStatus = (status: number, name: string) => {
        let text = ''
        let textColor = 'text-gray-500'
        let isUppercase = true

        switch (status) {
            case PurchasesStatus.delivered:
                text = 'Giao hàng thành công'
                textColor = 'text-green-500'
                isUppercase = false
                break
            case PurchasesStatus.cancelled:
                text = 'Đã hủy'
                textColor = 'text-red-500'
                break
            default:
                text = `Đang ${name}`
                break
        }

        return (
            <div className="absolute top-[10px] right-0 px-6">
                <span className={classNames('text-sm', textColor, { uppercase: isUppercase })}>
                    {text}
                </span>
            </div>
        )
    }

    const purchaseInCartData = purchaseListInCartData?.data.data
    console.log(purchaseInCartData)
    return (
        <div className="px-5">
            <div>
                <div className="sticky top-0 flex rounded-t-sm shadow-sm">
                    {renderPurchaseTabLink}
                </div>
            </div>
            <div>
                {purchaseInCartData?.map(purchase => {
                    const statusName = purchaseTab.find(item => item.status === purchase.status)?.name || 'chờ thanh toán'
                    return (
                        <div key={purchase.product._id} className="relative mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm">
                            {showStatus(purchase.status, statusName)}
                            <Link to={`${path.home}${generateNameId({
                                name: purchase.product.name,
                                id: purchase.product._id
                            })}`} className="flex border-b-gray-200 border-b p-2 mt-3 border-t-gray-200 border-t">
                                <div className="flex-shrink-0">
                                    <img src={purchase.product.image} alt={purchase.product.name} className="h-20 w-20 object-cover" />
                                </div>
                                <div className="ml-3 flex-grow overflow-hidden">
                                    <div className="truncate">{purchase.product.name}</div>
                                    <div className="mt-3">x{purchase.buy_count}</div>
                                </div>
                                <div className="ml-3 flex-shrink-0 my-auto">
                                    <span className="truncate line-through text-gray-500">
                                        ₫{formatCurrency(purchase.product.price_before_discount)}
                                    </span>
                                    <span className="ml-2 truncate text-orange">₫{formatCurrency(purchase.product.price)}</span>
                                </div>
                            </Link>
                            <div className="justify-end flex mt-7">
                                <div>
                                    <span>Tổng giá tiền</span>
                                    <span className="ml-4 text-xl text-orange">
                                        ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                                    </span>
                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
