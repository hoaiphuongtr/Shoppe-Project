import { useContext, useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { keyBy } from "lodash"
import { produce } from "immer"
import purchaseAPI from "src/apis/purchase.api"
import Button from "src/components/Button"
import { path } from "src/components/constants/path"
import { PurchasesStatus } from "src/components/constants/purchase"
import QuantityController from "src/components/QuantityController"
import { ExtendPurchase, PurchaseType } from "src/types/purchase.type"
import { formatCurrency, generateNameId } from "src/utils/utils"
import { AppContext } from "src/contexts/app.context"
import noProduct from 'src/assets/images/no-product.png'

export default function Cart() {
    const queryClient = useQueryClient()
    const { extendedPurchases, setExtendedPurchase } = useContext(AppContext)
    const location = useLocation();
    console.log(location.state)
    const chosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId
    const queryKey = ['purchases', { status: PurchasesStatus.inCart }]
    const { data: purchaseListInCartData, refetch } = useQuery({
        queryKey: queryKey,
        queryFn: () => purchaseAPI.getPurchaseList({ status: PurchasesStatus.inCart }),

    })
    const purchaseInCartData = purchaseListInCartData?.data.data
    const isAllChecked = useMemo(() => extendedPurchases?.every(purchase => purchase.checked), [extendedPurchases])
    const checkedPurchases = useMemo(() => extendedPurchases.filter(purchase => purchase.checked), [extendedPurchases])
    const checkedPurchasesCount = checkedPurchases.length
    const totalCheckedPurchasesPrice = useMemo(() => checkedPurchases.reduce((result, current) => {
        return result + current.price * current.buy_count
    }, 0), [checkedPurchases])
    const totalCheckedPurchasesSavingPrice = useMemo(() => checkedPurchases.reduce((result, current) => {
        return result + (current.price_before_discount - current.price) * current.buy_count
    }, 0), [checkedPurchases])
    const updatePurchaseMutation = useMutation({
        mutationFn: purchaseAPI.updatePurchase,
        onMutate: async (updatedPurchase) => {
            await queryClient.cancelQueries({ queryKey: queryKey })
            const previousData = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (oldData: any) => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        data: oldData.data.data.map((purchase: ExtendPurchase) => purchase.product._id === updatedPurchase.product_id ? { ...purchase, buy_count: updatedPurchase.buy_count } : purchase)
                    }
                }
            })
            return { previousData }
        },
        onError: (_err, _variables, context) => {
            context?.previousData && queryClient.setQueryData(queryKey, context.previousData)
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: queryKey })
    })
    const buyPurchasesMutation = useMutation({
        mutationFn: purchaseAPI.buyProducts,
        onSuccess: (data) => {
            toast.success(data.data.message, {
                position: "top-center",
                autoClose: 1000,
            })
            refetch()
        }

    })
    const deletePurchasesMutation = useMutation({
        mutationFn: purchaseAPI.deletePurchase,
        onSuccess: () => {
            refetch()
        }

    })

    useEffect(() => {
        setExtendedPurchase(prev => {
            const extendedPurchasesObject = keyBy(prev, '_id')
            return (purchaseInCartData?.map((purchase) => {
                const isChosenPurchaseFromLocation = purchase._id === chosenPurchaseIdFromLocation
                return {
                    ...purchase,
                    disabled: false,
                    checked: isChosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
                }
            }) || [])
        })
    }, [purchaseInCartData, chosenPurchaseIdFromLocation])
    useEffect(() => { return history.replaceState(null, "") })
    const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setExtendedPurchase(produce(draft => {
            draft[purchaseIndex].checked = event.target.checked
        }))
    }
    const handleCheckAll = () => {
        setExtendedPurchase(prev =>
            prev.map(purchase => ({
                ...purchase,
                checked: !isAllChecked

            })))
    }
    const handleQuantityType = (purchaseIndex: number) => (value: number) => {
        setExtendedPurchase(produce(draft => {
            draft[purchaseIndex].buy_count = value
        }))
    }
    const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
        const updatedBuyCount = value
        if (enable) {
            const purchase = extendedPurchases[purchaseIndex]
            setExtendedPurchase(produce(draft => {
                draft[purchaseIndex].disabled = true
            }))
            updatePurchaseMutation.mutate({
                product_id: purchase.product._id,
                buy_count: updatedBuyCount
            })
        }
    }
    const shouldUpdateQuantity = (purchaseIndex: number, value: number) => {
        const purchase = extendedPurchases[purchaseIndex]
        const serverBuyCount = (purchaseInCartData as PurchaseType[])[purchaseIndex].buy_count
        return (
            value !== serverBuyCount && value >= 1 && value <= purchase.product.quantity
        )
    }

    const handleDeletePurchase = (purchaseIndex: number) => () => {
        const purchaseID = extendedPurchases[purchaseIndex]._id
        deletePurchasesMutation.mutate([purchaseID])
    }
    const handleDeletePurchases = () => {
        const purchaseIDs = extendedPurchases.map(purchase => purchase._id)
        deletePurchasesMutation.mutate(purchaseIDs)
    }
    const handleBuyCheckedPurchases = () => {
        if (checkedPurchasesCount !== 0) {
            const body = checkedPurchases.map(purchase => {
                return {
                    product_id: purchase.product._id,
                    buy_count: purchase.buy_count
                }
            })
            buyPurchasesMutation.mutate(body)
        }
    }
    return (
        <div className='bg-neutral-100 py-5'>
            <div className='container ml-10 px-5'>
                {extendedPurchases.length > 0 ? (<>
                    <div className='overflow-auto'>
                        <div className='min-w-[1000px]'>
                            <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                                <div className='col-span-6'>
                                    <div className='flex items-center'>
                                        <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                                            <input type='checkbox' className='h-5 w-5 accent-orange' checked={isAllChecked} onChange={handleCheckAll} />
                                        </div>
                                        <div className='flex-grow text-black'>Sản phẩm</div>
                                    </div>
                                </div>
                                <div className='col-span-6'>
                                    <div className='grid grid-cols-5 text-center'>
                                        <div className='col-span-2'>Đơn giá</div>
                                        <div className='col-span-1'>Số lượng</div>
                                        <div className='col-span-1'>Số tiền</div>
                                        <div className='col-span-1'>Thao tác</div>
                                    </div>
                                </div>
                            </div>
                            <div className='my-3 rounded-sm bg-white p-5 shadow'>
                                {extendedPurchases?.map((purchase, index) => (
                                    <div
                                        key={purchase._id}
                                        className='mb-5 grid grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0 items-center'
                                    >
                                        <div className='col-span-6'>
                                            <div className='flex'>
                                                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                                                    <input type='checkbox' className='h-5 w-5 accent-orange' checked={purchase.checked} onChange={handleCheck(index)} />
                                                </div>
                                                <div className='flex-grow'>
                                                    <div className='flex items-center'>
                                                        <Link
                                                            className='h-20 w-20 flex-shrink-0'
                                                            to={`${path.home}${generateNameId({
                                                                name: purchase.product.name,
                                                                id: purchase.product._id
                                                            })}`}
                                                        >
                                                            <img alt={purchase.product.name} src={purchase.product.image} />
                                                        </Link>
                                                        <div className='flex-grow px-2 pt-1 pb-2 text-left'>
                                                            <Link
                                                                to={`${path.home}${generateNameId({
                                                                    name: purchase.product.name,
                                                                    id: purchase.product._id
                                                                })}`}
                                                                className='line-clamp-2'
                                                            >
                                                                {purchase.product.name}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-span-6'>
                                            <div className='grid grid-cols-5 items-center'>
                                                <div className='col-span-2'>
                                                    <div className='flex items-center justify-center'>
                                                        <span className='text-gray-300 line-through'>
                                                            ₫{formatCurrency(purchase.product.price_before_discount)}
                                                        </span>
                                                        <span className='ml-3'>₫{formatCurrency(purchase.product.price)}</span>
                                                    </div>
                                                </div>
                                                <div className='col-span-1'>
                                                    <QuantityController
                                                        max={purchase.product.quantity}
                                                        value={purchase.buy_count}
                                                        classNameWrapper='flex items-center'
                                                        onIncrease={value => handleQuantity(index, value, shouldUpdateQuantity(index, value))}
                                                        onDecrease={value => handleQuantity(index, value, shouldUpdateQuantity(index, value))}
                                                        onType={handleQuantityType(index)}
                                                        onFocusOut={value => handleQuantity(index, value, shouldUpdateQuantity(index, value))}
                                                        disabled={purchase.disabled}
                                                    />
                                                </div>
                                                <div className='col-span-1'>
                                                    <span className='text-orange'>
                                                        ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                                                    </span>
                                                </div>
                                                <div className='col-span-1'>
                                                    <button className='bg-none text-black transition-colors hover:text-orange' onClick={handleDeletePurchase(index)}>Xóa</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
                        <div className='flex items-center'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                                <input type='checkbox' className='h-5 w-5 accent-orange' checked={isAllChecked} onChange={handleCheckAll} />
                            </div>
                            <button className='mx-3 border-none bg-none' onClick={handleCheckAll}>Chọn tất cả ({extendedPurchases.length})</button>
                            <button className='mx-3 border-none bg-none' onClick={handleDeletePurchases}>Xóa</button>
                        </div>

                        <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                            <div>
                                <div className='flex items-center sm:justify-end'>
                                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                                    <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(totalCheckedPurchasesPrice)}</div>
                                </div>
                                <div className='flex items-center text-sm sm:justify-end'>
                                    <div className='text-gray-500'>Tiết kiệm</div>
                                    <div className='ml-6 text-orange'>₫{formatCurrency(totalCheckedPurchasesSavingPrice)}</div>
                                </div>
                            </div>
                            <Button className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0' onClick={handleBuyCheckedPurchases}>
                                Mua hàng
                            </Button>
                        </div>
                    </div>
                </>) : (
                    <div className='text-center'>
                        <img src={noProduct} alt='no purchase' className='mx-auto h-24 w-24 mt-16' />
                        <div className='mt-5 font-bold text-gray-400'>Giỏ hàng của bạn còn trống</div>
                        <div className='text-center my-6'>
                            <Link
                                to={path.home}
                                className=' rounded-sm bg-orange px-10 py-2  uppercase text-white transition-all hover:bg-orange/80'
                            >
                                Mua ngay
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
