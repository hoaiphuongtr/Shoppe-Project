export const PurchasesStatus = {
    inCart: -1,
    all: 0,
    waitforConfirmation: 1,
    beingGotten: 2,
    beingDelivered: 3,
    delivered: 4,
    cancelled: 5
} as const;
