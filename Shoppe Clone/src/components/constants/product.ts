export const sortBy = {
    createdAt: 'createdAt',
    view: 'view',
    sold: 'sold',
    price: 'price'
} as const;

export const order = {
    asc: 'asc',
    desc: 'desc'
} as const;

export type SortBy = (typeof sortBy)[keyof typeof sortBy];
export type Order = (typeof order)[keyof typeof order];
